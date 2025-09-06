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

    // Create Supabase client with service role key
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

    const { formData, calculatedResults } = await req.json();

    // Create analysis prompt for GPT
    const prompt = `
    As a professional real estate investment advisor, analyze this property investment:

    Property Details:
    - Purchase Price: $${formData.propertyPrice}
    - Down Payment: ${formData.downPayment}% ($${(parseFloat(formData.propertyPrice) * parseFloat(formData.downPayment) / 100).toLocaleString()})
    - Loan Term: ${formData.loanTerm} years
    - Interest Rate: ${formData.interestRate}%
    - Monthly Rent: $${formData.monthlyRent}
    - Monthly Expenses: $${formData.monthlyExpenses}
    - Closing Costs: $${formData.closingCosts}
    - Renovation Costs: $${formData.renovationCosts}

    Calculated Results:
    - Monthly Cash Flow: $${calculatedResults.monthlyCashFlow}
    - Annual Cash Flow: $${calculatedResults.annualCashFlow}
    - Cash-on-Cash Return: ${calculatedResults.cashOnCashReturn}%
    - Break-Even Point: ${calculatedResults.breakEvenPoint} months

    Please provide a comprehensive analysis including:
    1. Investment Grade (Excellent/Good/Fair/Poor)
    2. Key Strengths and Weaknesses
    3. Risk Assessment
    4. Market Considerations
    5. Actionable Recommendations

    Keep the analysis professional but accessible, around 200-300 words.
    `;

    // Call OpenAI GPT for analysis
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
            content: 'You are a professional real estate investment advisor with decades of experience. Provide clear, actionable investment advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API Error:', data);
      throw new Error(data.error?.message || 'Failed to analyze ROI');
    }

    const analysis = data.choices[0].message.content;

    // Save ROI calculation to database
    const { error: saveError } = await supabaseAdmin
      .from('roi_calculations')
      .insert({
        user_id: user.id,
        property_price: parseFloat(formData.propertyPrice),
        down_payment: parseFloat(formData.downPayment),
        loan_amount: calculatedResults.loanAmount,
        interest_rate: parseFloat(formData.interestRate),
        loan_term: parseInt(formData.loanTerm),
        monthly_rent: parseFloat(formData.monthlyRent),
        expenses: {
          monthly_expenses: parseFloat(formData.monthlyExpenses),
          closing_costs: parseFloat(formData.closingCosts),
          renovation_costs: parseFloat(formData.renovationCosts)
        },
        results: {
          ...calculatedResults,
          ai_analysis: analysis
        }
      });

    if (saveError) {
      console.error('Error saving ROI calculation:', saveError);
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in analyze-roi function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});