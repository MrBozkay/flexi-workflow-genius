
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Share, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const Workflows = () => {
  const [activeTab, setActiveTab] = useState<"editor" | "executions">("editor");
  const [workflowName, setWorkflowName] = useState("AI agent chat");
  const [isActive, setIsActive] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSave = () => {
    toast.success("Workflow saved successfully");
  };

  const handleShare = () => {
    toast.success("Sharing options opened");
  };

  const handleActiveToggle = (checked: boolean) => {
    setIsActive(checked);
    toast.success(`Workflow ${checked ? 'activated' : 'deactivated'}`);
  };

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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="px-1.5 hover:bg-transparent"
                  onClick={() => toast.info("Tag feature coming soon")}
                >
                  <Plus className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground ml-1">Add tag</span>
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Inactive</span>
                <Switch checked={isActive} onCheckedChange={handleActiveToggle} />
              </div>
              
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
            <WorkflowCanvas />
          ) : (
            <div className="p-6">
              <h2 className="text-lg font-medium">Executions History</h2>
              <p className="text-muted-foreground">No executions found for this workflow.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Workflows;
