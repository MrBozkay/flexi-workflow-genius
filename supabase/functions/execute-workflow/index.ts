
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get request body
    const { workflow_id } = await req.json()

    if (!workflow_id) {
      return new Response(
        JSON.stringify({ error: 'workflow_id is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the workflow
    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', workflow_id)
      .single()

    if (workflowError) {
      console.error('Error fetching workflow:', workflowError)
      return new Response(
        JSON.stringify({ error: 'Workflow not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Get the user who is executing the workflow (from auth token)
    const authHeader = req.headers.get('Authorization')?.split(' ')[1]
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader)
    if (userError || !user) {
      console.error('Error getting user:', userError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Check if the user is the owner of the workflow or if the workflow is public
    if (workflow.user_id !== user.id && !workflow.is_public) {
      return new Response(
        JSON.stringify({ error: 'You do not have permission to execute this workflow' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    // Create a new execution record
    const { data: execution, error: executionError } = await supabase
      .from('workflow_executions')
      .insert({
        workflow_id,
        user_id: user.id,
        status: 'running',
        input_data: {},
      })
      .select()
      .single()

    if (executionError) {
      console.error('Error creating execution record:', executionError)
      return new Response(
        JSON.stringify({ error: 'Failed to create execution record' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Execute the workflow (in a real implementation, this would be more complex)
    console.log(`Executing workflow ${workflow_id} for user ${user.id}`)
    console.log('Workflow nodes:', workflow.nodes)
    console.log('Workflow edges:', workflow.edges)

    // Simulate workflow execution with a delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update the execution record with completion
    const { error: updateError } = await supabase
      .from('workflow_executions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        output_data: { result: 'Workflow executed successfully' },
      })
      .eq('id', execution.id)

    if (updateError) {
      console.error('Error updating execution record:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update execution record' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Workflow executed successfully',
        execution_id: execution.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error executing workflow:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred during workflow execution' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
