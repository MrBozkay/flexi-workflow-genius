import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWorkflows, Workflow } from '@/hooks/useWorkflows'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas'
import { SettingsPanel } from '@/components/workflow/SettingsPanel'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

const Workflows = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { workflows, isLoading, createWorkflow, getWorkflowById, updateWorkflow } = useWorkflows()
  
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null)
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false)
  
  const workflowQuery = id ? getWorkflowById(id) : null
  const selectedWorkflow = workflowQuery?.data || null
  
  // Set the current workflow when the selected workflow changes
  useEffect(() => {
    if (selectedWorkflow) {
      setCurrentWorkflow(selectedWorkflow)
    } else if (id && !workflowQuery?.isLoading && !workflowQuery?.data) {
      // If we have an ID but no workflow data and we're not loading, it means the workflow doesn't exist
      toast.error('Workflow not found')
      navigate('/workflows')
    }
  }, [selectedWorkflow, id, workflowQuery?.isLoading, navigate])
  
  // Handle creating a new workflow
  const handleCreateWorkflow = async () => {
    if (!user) return
    
    // Create a new workflow with default values
    const newWorkflow = {
      name: 'New Workflow',
      description: 'My new workflow',
      nodes: [],
      edges: [],
      user_id: user.id,
      is_public: false,
      tags: []
    }
    
    // The createWorkflow function returns void because it's a mutation function
    // from React Query, so we can't directly assign its return value
    createWorkflow(newWorkflow, {
      onSuccess: (createdWorkflow: Workflow) => {
        // Navigate to the new workflow
        navigate(`/workflows/${createdWorkflow.id}`)
      }
    })
  }
  
  // Handle saving workflow changes
  const handleSaveWorkflow = (workflow: Partial<Workflow> & { id: string }) => {
    updateWorkflow(workflow)
  }
  
  // If we're on the /workflows route without an ID, show a list of workflows
  if (!id) {
    return (
      <AppLayout>
        <div className="container mx-auto py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Workflows</h1>
            <Button onClick={handleCreateWorkflow}>
              <Plus className="mr-2 h-4 w-4" /> Create Workflow
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : workflows.length === 0 ? (
            <div className="text-center py-16 bg-muted rounded-lg">
              <h3 className="text-lg font-medium mb-2">No workflows yet</h3>
              <p className="text-muted-foreground mb-4">Create your first workflow to get started</p>
              <Button onClick={handleCreateWorkflow}>
                <Plus className="mr-2 h-4 w-4" /> Create Workflow
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                  onClick={() => navigate(`/workflows/${workflow.id}`)}
                >
                  <h3 className="font-medium truncate">{workflow.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 h-10">{workflow.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-muted-foreground">
                      {new Date(workflow.updated_at).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-1">
                      {workflow.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-secondary rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AppLayout>
    )
  }
  
  // Otherwise, show the workflow editor
  return (
    <AppLayout>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {currentWorkflow ? (
          <>
            <div className="border-b bg-background z-10">
              <div className="container mx-auto p-4 flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-semibold">{currentWorkflow.name}</h1>
                  <p className="text-sm text-muted-foreground">{currentWorkflow.description}</p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline"
                    onClick={() => setIsSettingsPanelOpen(!isSettingsPanelOpen)}
                  >
                    Settings
                  </Button>
                  <Button onClick={() => handleSaveWorkflow(currentWorkflow)}>Save</Button>
                </div>
              </div>
            </div>
            <div className="flex-1 relative overflow-hidden">
              <WorkflowCanvas 
                workflow={currentWorkflow} 
                onWorkflowChange={setCurrentWorkflow} 
              />
              <SettingsPanel 
                isOpen={isSettingsPanelOpen} 
                onClose={() => setIsSettingsPanelOpen(false)}
                workflow={currentWorkflow}
                onWorkflowChange={setCurrentWorkflow}
              />
            </div>
          </>
        ) : workflowQuery?.isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Workflow not found</h3>
              <Button onClick={() => navigate('/workflows')}>
                Back to Workflows
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default Workflows
