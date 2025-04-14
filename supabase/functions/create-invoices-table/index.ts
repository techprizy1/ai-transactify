
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (_req) => {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check if the table exists
    const { data: existingTable, error: checkError } = await supabase
      .from('invoices')
      .select('id')
      .limit(1);
    
    if (checkError && checkError.code !== 'PGRST116') {
      // If error is not "relation does not exist", then something else went wrong
      throw new Error(`Error checking table: ${checkError.message}`);
    }
    
    if (!checkError) {
      // Table already exists
      return new Response(
        JSON.stringify({ message: "Invoices table already exists" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Create the table
    const { error: createError } = await supabase.rpc('create_invoices_table');
    
    if (createError) {
      throw new Error(`Error creating invoices table: ${createError.message}`);
    }
    
    return new Response(
      JSON.stringify({ message: "Invoices table created successfully" }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
