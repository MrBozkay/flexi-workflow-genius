
import { Request, Response } from 'express';
import { WorkflowService } from '../services/workflowService';

/**
 * Handle workflow API requests
 */
export async function handleWorkflowRequest(req: Request): Promise<{ status?: number; body?: any }> {
  try {
    const { method, path, query, body } = req;
    const pathSegments = path.split('/').filter(Boolean);
    
    // Get workflow ID from path if available
    const workflowId = pathSegments.length > 2 ? pathSegments[2] : null;
    
    // Handle different HTTP methods
    switch (method) {
      case 'GET':
        if (workflowId) {
          // Get a specific workflow
          const workflow = await WorkflowService.getWorkflowById(workflowId);
          return { body: workflow };
        } else {
          // Get user's workflows
          const userId = query.userId as string;
          if (!userId) {
            return { 
              status: 400, 
              body: { error: 'User ID is required' }
            };
          }
          const workflows = await WorkflowService.getUserWorkflows(userId);
          return { body: workflows };
        }
        
      case 'POST':
        // Create a new workflow
        const newWorkflow = await WorkflowService.createWorkflow(body);
        return { 
          status: 201, 
          body: newWorkflow 
        };
        
      case 'PUT':
        // Update an existing workflow
        if (!workflowId) {
          return { 
            status: 400, 
            body: { error: 'Workflow ID is required' }
          };
        }
        const updatedWorkflow = await WorkflowService.updateWorkflow(workflowId, body);
        return { body: updatedWorkflow };
        
      case 'DELETE':
        // Delete a workflow
        if (!workflowId) {
          return { 
            status: 400, 
            body: { error: 'Workflow ID is required' }
          };
        }
        await WorkflowService.deleteWorkflow(workflowId);
        return { status: 204 };
        
      default:
        return { 
          status: 405, 
          body: { error: 'Method not allowed' }
        };
    }
  } catch (error: any) {
    console.error('Error processing workflow request:', error);
    return { 
      status: 500, 
      body: { error: 'Internal Server Error', message: error.message }
    };
  }
}
