import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Chat request received with", messages.length, "messages");

    const systemPrompt = `You are LocalBot, a helpful AI assistant for LocalAid - a platform connecting customers with local service professionals in Tier 2 and Tier 3 cities across India.

Your primary functions:
1. Help users find the right service (electrician, plumber, beautician, AC repair, carpenter, appliance repair, painter, pest control, etc.)
2. Provide intelligent service recommendations based on user needs
3. Answer questions about services and pricing
4. Guide users to the Services page to book

Available Services with Pricing:
- Electrician: ₹199 - Minor repairs, socket installation, wiring
- Plumber: ₹199 - Leak repairs, pipe fitting, tap installation
- AC Repair: ₹499 - Cleaning, servicing, gas refilling
- Home Cleaning: ₹699 - 1BHK basic cleaning
- Salon (Men): ₹499 - Haircut, shave, grooming
- Salon (Women): ₹699 - Haircut, threading, waxing
- Carpenter: ₹299 - Furniture repair, woodwork
- Painter: ₹399 - Wall painting, touch-ups
- Pest Control: ₹799 - Residential pest treatment
- Appliance Repair: ₹299 - Washing machine, fridge repairs

Smart Recommendations:
- When user mentions a problem, suggest the appropriate service
- For example: "AC not cooling" → Recommend AC Repair service
- "Leaking tap" → Recommend Plumber service
- "Need haircut" → Recommend Salon service

Service Areas: Kanpur, Lucknow, Patna, Indore, Bhopal, Ludhiana, Agra, Varanasi, Nashik, Jaipur, Kota, Gwalior, Jabalpur, Raipur

Key Features:
- All professionals are background-verified
- 4.5+ star average rating
- Same-day booking available
- 24-hour cancellation policy
- Service guarantee

When users want to book:
1. Direct them to visit the Services page
2. Tell them to browse services and click "Book Now"
3. They can filter by city and view pricing there

Be friendly, conversational, and solution-oriented. Use simple language. Provide specific service suggestions based on user needs.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
