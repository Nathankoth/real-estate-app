import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[MARKET-ANALYTICS] ${step}${detailsStr}`);
};

// Mock market data generator
const generateMarketData = (address: string) => {
  const basePrice = Math.floor(Math.random() * 200000) + 300000; // $300k-$500k
  const growth = (Math.random() * 20 - 5).toFixed(1); // -5% to +15%
  const avgRent = Math.floor(basePrice * 0.008); // ~0.8% of property value monthly
  const daysOnMarket = Math.floor(Math.random() * 60) + 15; // 15-75 days
  
  return {
    address,
    marketPrice: basePrice,
    estimatedRent: avgRent,
    growthRate: `${growth}%`,
    daysOnMarket,
    marketTrend: parseFloat(growth) > 0 ? 'up' : 'down',
    comparableProperties: Math.floor(Math.random() * 50) + 10,
    neighborhood: {
      name: address.split(',')[1]?.trim() || 'Unknown Area',
      averagePrice: Math.floor(basePrice * (0.9 + Math.random() * 0.2)),
      inventory: Math.floor(Math.random() * 100) + 20
    },
    lastUpdated: new Date().toISOString()
  };
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const { address } = await req.json();
    if (!address) {
      throw new Error("Address is required");
    }

    logStep("Analyzing address", { address });

    // Check cache first
    const { data: cached } = await supabaseClient
      .from("analytics_cache")
      .select("*")
      .eq("address", address)
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // 24 hours
      .single();

    if (cached) {
      logStep("Returning cached data");
      return new Response(JSON.stringify(cached.data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Generate new market data (in production, this would call real APIs)
    const marketData = generateMarketData(address);
    logStep("Generated market data", { marketData });

    // Cache the result
    await supabaseClient
      .from("analytics_cache")
      .insert({
        address,
        data: marketData
      });

    logStep("Cached market data");

    return new Response(JSON.stringify(marketData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in market-analytics", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});