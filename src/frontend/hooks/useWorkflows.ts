
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/frontend/lib/supabase'
import { useAuth } from '@/frontend/contexts/AuthContext'

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

export const useWorkflows = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Fetch all workflows for the current user
  const getWorkflows = async (): Promise<Workflow[]> => {
    if (!user) return []
    
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  // Get a specific workflow by ID
  const getWorkflowById = async (id: string): Promise<Workflow | null> => {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  // Create a new workflow
  const createWorkflow = async (workflow: Partial<Workflow>): Promise<Workflow> => {
    if (!user) throw new Error('User not authenticated')
    
    const newWorkflow = {
      ...workflow,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('workflows')
      .insert(newWorkflow)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Update an existing workflow
  const updateWorkflow = async ({ id, ...updates }: Partial<Workflow> & { id: string }): Promise<Workflow> => {
    const { data, error } = await supabase
      .from('workflows')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Delete a workflow
  const deleteWorkflow = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('workflows')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  // React Query hooks
  const workflowsQuery = useQuery({
    queryKey: ['workflows', user?.id],
    queryFn: getWorkflows,
    enabled: !!user
  })

  const workflowByIdQuery = (id: string) => useQuery({
    queryKey: ['workflow', id],
    queryFn: () => getWorkflowById(id),
    enabled: !!id && !!user
  })

  const createWorkflowMutation = useMutation({
    mutationFn: createWorkflow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows', user?.id] })
    }
  })

  const updateWorkflowMutation = useMutation({
    mutationFn: updateWorkflow,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['workflows', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['workflow', data.id] })
    }
  })

  const deleteWorkflowMutation = useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows', user?.id] })
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
