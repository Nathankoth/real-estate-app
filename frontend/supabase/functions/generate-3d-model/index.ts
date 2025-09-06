import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting 3D model generation...');
    
    // Create authenticated Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get user from auth token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      throw new Error('Authentication failed');
    }

    // Check if user has premium access
    const { data: usage } = await supabaseClient
      .from('user_usage')
      .select('is_premium')
      .eq('user_id', user.id)
      .single();

    if (!usage?.is_premium) {
      return new Response(JSON.stringify({ 
        error: '3D generation requires a premium subscription' 
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { prompt, fileData, projectName, description } = await req.json();

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    console.log('Generating 3D visualization with OpenAI...');

    // Use OpenAI to generate a detailed 3D visualization description
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `You are an expert 3D visualization specialist for real estate and interior design. 
            Create detailed descriptions for 3D models and visualizations based on user inputs.
            Focus on architectural elements, spatial relationships, materials, lighting, and atmosphere.
            Provide technical specifications that could be used for 3D rendering or modeling.`
          },
          {
            role: 'user',
            content: `Create a detailed 3D visualization description for: ${prompt}
            
            Include:
            - Spatial layout and dimensions
            - Material specifications
            - Lighting setup
            - Color scheme
            - Furniture and decor placement
            - Architectural details
            - Atmosphere and mood
            
            Make it suitable for 3D rendering or architectural visualization.`
          }
        ],
        max_completion_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedDescription = data.choices[0].message.content;

    // Generate a visualization image using OpenAI Images API
    console.log('Generating 3D visualization image...');
    
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: `3D architectural visualization: ${prompt}. Professional 3D render, high quality, realistic materials and lighting, interior design, modern architecture style`,
        size: '1536x1024',
        quality: 'high',
        output_format: 'png'
      }),
    });

    if (!imageResponse.ok) {
      const errorData = await imageResponse.text();
      console.error('OpenAI Images API error:', errorData);
      throw new Error(`OpenAI Images API error: ${imageResponse.status}`);
    }

    const imageData = await imageResponse.json();
    const imageBase64 = imageData.data[0].b64_json;

    // Save the project to the database
    const { data: project, error: projectError } = await supabaseClient
      .from('projects_3d')
      .insert({
        user_id: user.id,
        name: projectName || 'Untitled 3D Project',
        description: description || '',
        style_prompt: prompt,
        generated_model_url: `data:image/png;base64,${imageBase64}`,
        generation_settings: {
          model: 'gpt-image-1',
          size: '1536x1024',
          quality: 'high',
          generated_description: generatedDescription
        }
      })
      .select()
      .single();

    if (projectError) {
      console.error('Database error:', projectError);
      throw new Error('Failed to save project');
    }

    console.log('3D model generation completed successfully');

    return new Response(JSON.stringify({
      success: true,
      project: project,
      description: generatedDescription,
      imageUrl: `data:image/png;base64,${imageBase64}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-3d-model function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});