
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  billTo: {
    name: string;
    address: string;
    email?: string;
  };
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

interface BusinessInfo {
  business_name: string | null;
  business_address: string | null;
  contact_number: string | null;
  gstn_number: string | null;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, businessInfo } = await req.json();

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    console.log('Processing invoice prompt:', prompt);
    console.log('Business info:', businessInfo);

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the next invoice number
    const { data: counterData, error: counterError } = await supabase
      .from('invoice_counter')
      .select('counter')
      .single();

    let nextCounter = 1;
    if (counterError) {
      if (counterError.code === 'PGRST116') {
        // Table doesn't exist, create it
        await supabase.rpc('create_invoice_counter');
        
        // Insert initial counter
        await supabase
          .from('invoice_counter')
          .insert({ counter: 1 });
      } else {
        console.error('Error getting invoice counter:', counterError);
      }
    } else if (counterData) {
      nextCounter = counterData.counter;
      
      // Update the counter for the next invoice
      await supabase
        .from('invoice_counter')
        .update({ counter: nextCounter + 1 })
        .eq('id', 1);
    }

    // Format the invoice number with leading zeros
    const uniqueInvoiceNumber = `INV-${String(nextCounter).padStart(3, '0')}`;

    // Enhance the system prompt with business information and include generated invoice number
    let systemPrompt = `You are an AI assistant that helps generate invoice data from user descriptions.
            Extract information and return ONLY a JSON object with the following structure:
            {
              "invoiceNumber": "${uniqueInvoiceNumber}",
              "date": "string in YYYY-MM-DD format (use today if not specified)",
              "dueDate": "string in YYYY-MM-DD format (default to 15 days from date if not specified)",
              "billTo": {
                "name": "string (company or person name)",
                "address": "string (full address)",
                "email": "string (optional)"
              },
              "items": [
                {
                  "description": "string (item description)",
                  "quantity": number,
                  "unitPrice": number,
                  "amount": number (quantity * unitPrice)
                }
              ],
              "subtotal": number (sum of all item amounts)",
              "taxRate": number (percentage, default to 18% if not specified)",
              "taxAmount": number (subtotal * taxRate / 100)",
              "total": number (subtotal + taxAmount)"
            }
            Fill in any missing details with reasonable defaults. Always use the exact invoice number provided: ${uniqueInvoiceNumber}. Do not include any explanations in your response, only the JSON object.`;

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
    let invoiceData: InvoiceData;
    
    try {
      // First try to parse directly from the content
      const content = data.choices[0].message.content;
      
      // Find JSON object in the response if there's any extra text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      invoiceData = JSON.parse(jsonStr);
      
      // Ensure the invoice number is the unique one we generated
      invoiceData.invoiceNumber = uniqueInvoiceNumber;
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

    const finalInvoiceData = {
      ...invoiceData,
      businessInfo
    };

    return new Response(JSON.stringify(finalInvoiceData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-invoice function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
