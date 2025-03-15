
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { Json } from '@/integrations/supabase/types'

// Define the Workflow type that matches our database structure
export interface Workflow {
  id: string
  name: string
  description: string | null
  nodes: any[] // Using any[] to match expected type
  edges: any[] // Using any[] to match expected type
  created_at: string
  updated_at: string
  user_id: string
  is_public: boolean
  tags: string[]
}

// Helper function to convert Supabase workflow data to our Workflow type
const convertSupabaseWorkflow = (data: any): Workflow => {
  return {
    ...data,
    // Parse JSON strings if they come as strings
    nodes: typeof data.nodes === 'string' ? JSON.parse(data.nodes) : data.nodes,
    edges: typeof data.edges === 'string' ? JSON.parse(data.edges) : data.edges,
  }
}

export const useWorkflows = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const fetchWorkflows = async (): Promise<Workflow[]> => {
    if (!user) return []

    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching workflows:', error)
      throw error
    }

    // Convert all workflow data to our Workflow type
    return data.map(convertSupabaseWorkflow)
  }

  const fetchWorkflowById = async (id: string): Promise<Workflow> => {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching workflow:', error)
      throw error
    }

    return convertSupabaseWorkflow(data)
  }

  const createWorkflow = async (workflow: Omit<Workflow, 'id' | 'created_at' | 'updated_at'>): Promise<Workflow> => {
    if (!user) throw new Error('User not authenticated')

    // Ensure required fields are present
    const workflowData = {
      ...workflow,
      name: workflow.name || 'Untitled Workflow', // Ensure name is always set
      user_id: user.id
    }

    const { data, error } = await supabase
      .from('workflows')
      .insert(workflowData)
      .select()
      .single()

    if (error) {
      console.error('Error creating workflow:', error)
      throw error
    }

    return convertSupabaseWorkflow(data)
  }

  const updateWorkflow = async (workflow: Partial<Workflow> & { id: string }): Promise<Workflow> => {
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('workflows')
      .update(workflow)
      .eq('id', workflow.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating workflow:', error)
      throw error
    }

    return convertSupabaseWorkflow(data)
  }

  const deleteWorkflow = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('workflows')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting workflow:', error)
      throw error
    }
  }

  // React Query hooks
  const workflowsQuery = useQuery({
    queryKey: ['workflows', user?.id],
    queryFn: fetchWorkflows,
    enabled: !!user
  })

  const workflowByIdQuery = (id: string) => useQuery({
    queryKey: ['workflow', id],
    queryFn: () => fetchWorkflowById(id),
    enabled: !!id && !!user
  })

  const createWorkflowMutation = useMutation({
    mutationFn: createWorkflow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows', user?.id] })
      toast.success('Workflow created successfully')
    },
    onError: (error: any) => {
      toast.error(`Error creating workflow: ${error.message}`)
    }
  })

  const updateWorkflowMutation = useMutation({
    mutationFn: updateWorkflow,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['workflows', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['workflow', data.id] })
      toast.success('Workflow updated successfully')
    },
    onError: (error: any) => {
      toast.error(`Error updating workflow: ${error.message}`)
    }
  })

  const deleteWorkflowMutation = useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows', user?.id] })
      toast.success('Workflow deleted successfully')
    },
    onError: (error: any) => {
      toast.error(`Error deleting workflow: ${error.message}`)
    }
  })

  return {
    workflows: workflowsQuery.data || [],
    isLoading: workflowsQuery.isLoading,
    error: workflowsQuery.error,
    getWorkflowById: workflowByIdQuery,
    createWorkflow: createWorkflowMutation.mutate,
    updateWorkflow: updateWorkflowMutation.mutate,
    deleteWorkflow: deleteWorkflowMutation.mutate
  }
}
