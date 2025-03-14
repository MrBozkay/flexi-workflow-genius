
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string

// Create a Supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export interface Workflow {
  id: string
  name: string
  description: string
  nodes: any[]
  edges: any[]
  created_at: string
  updated_at: string
  user_id: string
  is_public: boolean
  tags: string[]
}

/**
 * Workflow service to handle CRUD operations for workflows
 */
export class WorkflowService {
  /**
   * Get all workflows for a user
   */
  static async getUserWorkflows(userId: string): Promise<Workflow[]> {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  /**
   * Get a workflow by ID
   */
  static async getWorkflowById(id: string): Promise<Workflow | null> {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  /**
   * Create a new workflow
   */
  static async createWorkflow(workflow: Partial<Workflow>): Promise<Workflow> {
    const { data, error } = await supabase
      .from('workflows')
      .insert(workflow)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  /**
   * Update an existing workflow
   */
  static async updateWorkflow(id: string, workflow: Partial<Workflow>): Promise<Workflow> {
    const { data, error } = await supabase
      .from('workflows')
      .update(workflow)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  /**
   * Delete a workflow
   */
  static async deleteWorkflow(id: string): Promise<void> {
    const { error } = await supabase
      .from('workflows')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
