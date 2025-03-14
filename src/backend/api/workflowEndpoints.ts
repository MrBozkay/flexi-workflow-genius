
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { WorkflowService } from '../services/workflowService.ts'

/**
 * Handle workflow API requests
 */
export async function handleWorkflowRequest(req: Request): Promise<Response> {
  try {
    const { method, url } = req
    const urlObj = new URL(url)
    const path = urlObj.pathname
    const pathSegments = path.split('/').filter(Boolean)
    
    // Get workflow ID from path if available
    const workflowId = pathSegments.length > 2 ? pathSegments[2] : null
    
    // Handle different HTTP methods
    switch (method) {
      case 'GET':
        if (workflowId) {
          // Get a specific workflow
          const workflow = await WorkflowService.getWorkflowById(workflowId)
          return new Response(JSON.stringify(workflow), {
            headers: { 'Content-Type': 'application/json' },
          })
        } else {
          // Get user's workflows
          const userId = urlObj.searchParams.get('userId')
          if (!userId) {
            return new Response(
              JSON.stringify({ error: 'User ID is required' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
          }
          const workflows = await WorkflowService.getUserWorkflows(userId)
          return new Response(JSON.stringify(workflows), {
            headers: { 'Content-Type': 'application/json' },
          })
        }
        
      case 'POST':
        // Create a new workflow
        const createData = await req.json()
        const newWorkflow = await WorkflowService.createWorkflow(createData)
        return new Response(JSON.stringify(newWorkflow), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        })
        
      case 'PUT':
        // Update an existing workflow
        if (!workflowId) {
          return new Response(
            JSON.stringify({ error: 'Workflow ID is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          )
        }
        const updateData = await req.json()
        const updatedWorkflow = await WorkflowService.updateWorkflow(workflowId, updateData)
        return new Response(JSON.stringify(updatedWorkflow), {
          headers: { 'Content-Type': 'application/json' },
        })
        
      case 'DELETE':
        // Delete a workflow
        if (!workflowId) {
          return new Response(
            JSON.stringify({ error: 'Workflow ID is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          )
        }
        await WorkflowService.deleteWorkflow(workflowId)
        return new Response(null, { status: 204 })
        
      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Error processing workflow request:', error)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
