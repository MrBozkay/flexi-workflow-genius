
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export interface Workflow {
  id: string
  name: string
  description: string | null
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
    
    if (error) {
      console.error('Error fetching workflows:', error)
      throw error
    }
    
    return data || []
  }

  // Get a specific workflow by ID
  const getWorkflowById = async (id: string): Promise<Workflow | null> => {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code !== 'PGRST116') { // Not found error
        console.error('Error fetching workflow:', error)
        throw error
      }
      return null
    }
    
    return data
  }

  // Create a new workflow
  const createWorkflow = async (workflow: Partial<Workflow>): Promise<Workflow> => {
    if (!user) throw new Error('User not authenticated')
    
    const newWorkflow = {
      ...workflow,
      user_id: user.id
    }
    
    const { data, error } = await supabase
      .from('workflows')
      .insert(newWorkflow)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating workflow:', error)
      throw error
    }
    
    return data
  }

  // Update an existing workflow
  const updateWorkflow = async ({ id, ...updates }: Partial<Workflow> & { id: string }): Promise<Workflow> => {
    const { data, error } = await supabase
      .from('workflows')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating workflow:', error)
      throw error
    }
    
    return data
  }

  // Delete a workflow
  const deleteWorkflow = async (id: string): Promise<void> => {
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
