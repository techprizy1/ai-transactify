
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PurchaseOrderResponse {
  supplier_name: string;
  items: {
    description: string;
    quantity: number;
    unit_price: number;
    amount: number;
  }[];
  delivery_date: string; // In YYYY-MM-DD format
  payment_terms: string;
  shipping_address: string;
  total_amount: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    console.log('Processing purchase order prompt:', prompt);

    const systemPrompt = `You are an AI assistant that helps generate purchase order data from user descriptions.
      Extract information and return ONLY a JSON object with the following structure:
      {
        "supplier_name": "string (name of supplier/vendor)",
        "items": [
          {
            "description": "string (item description)",
            "quantity": number,
            "unit_price": number,
            "amount": number (quantity * unit_price)
          }
        ],
        "delivery_date": "string in YYYY-MM-DD format (use a reasonable date if not specified)",
        "payment_terms": "string (e.g., '30 days', 'Net 15', 'COD', etc.)",
        "shipping_address": "string (address for delivery)",
        "total_amount": number (sum of all item amounts)"
      }
      
      Fill in any missing details with reasonable defaults. Do not include any explanations in your response, only the JSON object.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    let poData: PurchaseOrderResponse;
    
    try {
      // First try to parse directly from the content
      const content = data.choices[0].message.content;
      
      // Find JSON object in the response if there's any extra text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      poData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Failed to parse AI response',
        aiResponse: data.choices[0].message.content 
      }), {
        status: 422,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(poData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-purchase-order function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
