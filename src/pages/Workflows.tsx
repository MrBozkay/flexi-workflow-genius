
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Share, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { useWorkflows, Workflow } from '@/hooks/useWorkflows';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

const Workflows = () => {
  const [activeTab, setActiveTab] = useState<"editor" | "executions">("editor");
  const [workflowName, setWorkflowName] = useState("New Workflow");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isNewWorkflow, setIsNewWorkflow] = useState(false);
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [newWorkflowDescription, setNewWorkflowDescription] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    workflows, 
    isLoading, 
    getWorkflowById, 
    createWorkflow, 
    updateWorkflow, 
    deleteWorkflow 
  } = useWorkflows();

  // Get workflow data if ID is provided
  const { data: currentWorkflow, isLoading: isWorkflowLoading } = getWorkflowById(id || '');

  useEffect(() => {
    if (id && currentWorkflow) {
      setWorkflowName(currentWorkflow.name);
      setWorkflowDescription(currentWorkflow.description || '');
      setNodes(currentWorkflow.nodes || []);
      setEdges(currentWorkflow.edges || []);
      setIsActive(currentWorkflow.is_public);
      setIsNewWorkflow(false);
    } else if (!id) {
      // New workflow
      setWorkflowName("New Workflow");
      setWorkflowDescription("");
      setNodes([]);
      setEdges([]);
      setIsActive(false);
      setIsNewWorkflow(true);
    }
  }, [id, currentWorkflow]);

  const handleSave = async () => {
    if (id && currentWorkflow) {
      // Update existing workflow
      await updateWorkflow({
        id,
        name: workflowName,
        description: workflowDescription,
        nodes,
        edges,
        is_public: isActive
      });
    } else {
      // Create new workflow
      const newWorkflow = await createWorkflow({
        name: workflowName,
        description: workflowDescription,
        nodes,
        edges,
        is_public: isActive,
        tags: []
      }) as Workflow;
      
      // Navigate to the new workflow
      navigate(`/workflows/${newWorkflow.id}`);
      setIsNewWorkflow(false);
    }
  };

  const handleShare = () => {
    // Implementation for workflow sharing will go here
    toast.success("Sharing options opened");
  };

  const handleActiveToggle = (checked: boolean) => {
    setIsActive(checked);
    if (id) {
      updateWorkflow({
        id,
        is_public: checked
      });
    }
  };

  const handleCreateWorkflow = () => {
    createWorkflow({
      name: newWorkflowName,
      description: newWorkflowDescription,
      nodes: [],
      edges: [],
      is_public: false,
      tags: []
    });
    setIsCreateDialogOpen(false);
    setNewWorkflowName("");
    setNewWorkflowDescription("");
  };

  const handleDeleteWorkflow = async () => {
    if (id) {
      await deleteWorkflow(id);
      navigate('/workflows');
      setIsDeleteDialogOpen(false);
    }
  };

  const handleNodesChange = (newNodes: any[]) => {
    setNodes(newNodes);
  };

  const handleEdgesChange = (newEdges: any[]) => {
    setEdges(newEdges);
  };

  if (isLoading || isWorkflowLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 relative">
              <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
              <div className="absolute inset-4 rounded-full bg-primary/30"></div>
            </div>
            <p className="mt-4 text-lg font-medium">Loading workflow...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-full w-full overflow-hidden">
        {/* Workflow navbar */}
        <div className="border-b border-border bg-card py-2 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <input
                  type="text"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  className="px-1 py-0.5 text-lg font-medium bg-transparent border-0 border-b border-transparent hover:border-primary focus:border-primary focus:ring-0 focus:outline-none"
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="px-1.5 hover:bg-transparent"
                    >
                      <Plus className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground ml-1">Add tag</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Tags</DialogTitle>
                      <DialogDescription>
                        Add tags to help organize your workflows.
                      </DialogDescription>
                    </DialogHeader>
                    {/* Tag selection UI will go here */}
                    <div className="py-4">
                      <p className="text-sm text-muted-foreground">Tag functionality coming soon</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Private</span>
                <Switch checked={isActive} onCheckedChange={handleActiveToggle} />
                <span className="text-sm text-muted-foreground">Public</span>
              </div>
              
              {!isNewWorkflow && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={handleShare}
              >
                <Share className="h-4 w-4" />
                <span>Share</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={handleSave}
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </Button>
            </div>
          </div>
          
          {/* Editor/Executions tabs */}
          <div className="mt-3">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "editor" | "executions")} className="w-fit">
              <TabsList>
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="executions">Executions</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Workflow content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "editor" ? (
            <WorkflowCanvas 
              initialNodes={nodes} 
              initialEdges={edges} 
              onNodesChange={handleNodesChange} 
              onEdgesChange={handleEdgesChange} 
            />
          ) : (
            <div className="p-6">
              <h2 className="text-lg font-medium">Executions History</h2>
              <p className="text-muted-foreground">No executions found for this workflow.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Workflow Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
            <DialogDescription>
              Enter the details for your new workflow.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="workflow-name">Workflow Name</Label>
              <Input 
                id="workflow-name" 
                value={newWorkflowName} 
                onChange={(e) => setNewWorkflowName(e.target.value)} 
                placeholder="My Workflow"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workflow-description">Description (optional)</Label>
              <Textarea 
                id="workflow-description" 
                value={newWorkflowDescription} 
                onChange={(e) => setNewWorkflowDescription(e.target.value)} 
                placeholder="Describe what this workflow does"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateWorkflow} disabled={!newWorkflowName.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Workflow Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workflow</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this workflow? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteWorkflow}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Workflows;
