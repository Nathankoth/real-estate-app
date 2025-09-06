import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create Supabase client with service role key for usage tracking
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from request
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: userData } = await supabaseAdmin.auth.getUser(token);
    const user = userData.user;
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { prompt, originalImageUrl, referenceImageUrl } = await req.json();

    // Check user's generation count
    const { data: userUsage } = await supabaseAdmin
      .from('user_usage')
      .select('generations_used, is_premium')
      .eq('user_id', user.id)
      .single();

    if (!userUsage?.is_premium && (userUsage?.generations_used || 0) >= 10) {
      return new Response(JSON.stringify({ 
        error: 'Free tier limit reached. Please upgrade to continue generating images.' 
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Generate image with OpenAI
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: `Transform this interior space: ${prompt}. Create a professional, high-quality interior design visualization.`,
        n: 1,
        size: '1024x1024',
        quality: 'high',
        output_format: 'png'
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API Error:', data);
      throw new Error(data.error?.message || 'Failed to generate image');
    }

    const imageData = data.data[0];
    const base64Image = `data:image/png;base64,${imageData.b64_json}`;

    // Save generated image to database
    const { data: savedImage, error: saveError } = await supabaseAdmin
      .from('generated_images')
      .insert({
        user_id: user.id,
        image_url: base64Image,
        original_image_url: originalImageUrl,
        reference_image_url: referenceImageUrl,
        style_prompt: prompt,
        generation_settings: {
          model: 'gpt-image-1',
          size: '1024x1024',
          quality: 'high'
        }
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving image:', saveError);
    }

    // Update user usage count
    await supabaseAdmin
      .from('user_usage')
      .upsert({
        user_id: user.id,
        generations_used: (userUsage?.generations_used || 0) + 1,
        is_premium: userUsage?.is_premium || false
      });

    return new Response(JSON.stringify({ 
      image: base64Image,
      generationsRemaining: userUsage?.is_premium ? 'unlimited' : Math.max(0, 10 - ((userUsage?.generations_used || 0) + 1))
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in generate-2d-image function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});