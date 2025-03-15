
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2, X } from 'lucide-react';
import { Workflow } from '@/hooks/useWorkflows';

export interface SettingsPanelProps {
  nodeId?: string;
  nodes?: any[];
  setNodes?: React.Dispatch<React.SetStateAction<any[]>>;
  isOpen?: boolean;
  onClose?: () => void;
  workflow?: Workflow;
  onWorkflowChange?: React.Dispatch<React.SetStateAction<Workflow>>;
}

export function SettingsPanel({ 
  nodeId, 
  nodes, 
  setNodes,
  isOpen = false,
  onClose,
  workflow,
  onWorkflowChange
}: SettingsPanelProps) {
  // Handle node settings if nodeId is provided
  if (nodeId && nodes && setNodes) {
    return <NodeSettings nodeId={nodeId} nodes={nodes} setNodes={setNodes} />;
  }
  
  // Handle workflow settings if workflow is provided
  if (isOpen && workflow && onWorkflowChange) {
    return (
      <div className="fixed top-0 right-0 w-80 h-full bg-card border-l border-border shadow-md z-50 overflow-y-auto">
        <WorkflowSettings 
          workflow={workflow} 
          onWorkflowChange={onWorkflowChange} 
          onClose={onClose} 
        />
      </div>
    );
  }
  
  return null;
}

interface NodeSettingsProps {
  nodeId: string;
  nodes: any[];
  setNodes: React.Dispatch<React.SetStateAction<any[]>>;
}

function NodeSettings({ nodeId, nodes, setNodes }: NodeSettingsProps) {
  const node = nodes.find((n) => n.id === nodeId);
  const [formState, setFormState] = useState({
    label: '',
    description: '',
  });

  useEffect(() => {
    if (node) {
      setFormState({
        label: node.data.label || '',
        description: node.data.description || '',
      });
    }
  }, [node]);

  const updateNodeData = () => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeId) {
          return {
            ...n,
            data: {
              ...n.data,
              label: formState.label,
              description: formState.description,
            },
          };
        }
        return n;
      })
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = () => {
    updateNodeData();
  };

  return (
    <div className="p-3 space-y-4">
      <div>
        <h3 className="font-medium text-sm mb-1">Node Settings</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Configure the properties of this {node?.type} node.
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            name="label"
            value={formState.label}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Node label"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formState.description}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Node description"
            rows={3}
          />
        </div>

        {node?.type === 'trigger' && (
          <div className="p-3 bg-muted/50 rounded-md">
            <h4 className="text-xs font-medium mb-2">Trigger Settings</h4>
            <div className="space-y-2">
              <Label htmlFor="triggerType" className="text-xs">Trigger Type</Label>
              <Input
                id="triggerType"
                placeholder="webhook"
                disabled
                className="text-xs h-8"
              />
              <p className="text-[10px] text-muted-foreground">
                This webhook will receive data and start the workflow.
              </p>
            </div>
          </div>
        )}

        {node?.type === 'ai' && (
          <div className="p-3 bg-muted/50 rounded-md">
            <h4 className="text-xs font-medium mb-2">AI Model Settings</h4>
            <div className="space-y-2">
              <Label htmlFor="model" className="text-xs">Model</Label>
              <Input
                id="model"
                placeholder="gpt-4o"
                className="text-xs h-8"
              />
              <Label htmlFor="prompt" className="text-xs">System Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="You are a helpful assistant..."
                className="text-xs"
                rows={3}
              />
            </div>
          </div>
        )}

        {node?.type === 'condition' && (
          <div className="p-3 bg-muted/50 rounded-md">
            <h4 className="text-xs font-medium mb-2">Condition Settings</h4>
            <div className="space-y-2">
              <Label htmlFor="condition" className="text-xs">Condition Expression</Label>
              <Textarea
                id="condition"
                placeholder="data.sentiment === 'positive'"
                className="text-xs"
                rows={2}
              />
            </div>
          </div>
        )}

        {node?.type === 'action' && (
          <div className="p-3 bg-muted/50 rounded-md">
            <h4 className="text-xs font-medium mb-2">Action Settings</h4>
            <div className="space-y-2">
              <Label htmlFor="actionType" className="text-xs">Action Type</Label>
              <Input
                id="actionType"
                placeholder="API Request"
                className="text-xs h-8"
              />
              <Label htmlFor="actionConfig" className="text-xs">Configuration</Label>
              <Textarea
                id="actionConfig"
                placeholder="URL, method, headers, etc."
                className="text-xs"
                rows={3}
              />
            </div>
          </div>
        )}
      </div>

      <div className="pt-2 flex justify-between">
        <Button variant="outline" size="sm" className="text-xs gap-1 h-8">
          <Trash2 className="w-3 h-3" />
          Delete Node
        </Button>
        <Button variant="default" size="sm" className="text-xs h-8">
          Apply Changes
        </Button>
      </div>
    </div>
  );
}

interface WorkflowSettingsProps {
  workflow: Workflow;
  onWorkflowChange: React.Dispatch<React.SetStateAction<Workflow>>;
  onClose?: () => void;
}

function WorkflowSettings({ workflow, onWorkflowChange, onClose }: WorkflowSettingsProps) {
  const [formState, setFormState] = useState({
    name: workflow.name || '',
    description: workflow.description || '',
    is_public: workflow.is_public || false,
    tags: workflow.tags?.join(', ') || '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormState((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSave = () => {
    onWorkflowChange({
      ...workflow,
      name: formState.name,
      description: formState.description,
      is_public: formState.is_public,
      tags: formState.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    });
    
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Workflow Settings</h2>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Workflow Name</Label>
          <Input
            id="name"
            name="name"
            value={formState.name}
            onChange={handleInputChange}
            placeholder="My Workflow"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formState.description || ''}
            onChange={handleInputChange}
            placeholder="What this workflow does..."
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            name="tags"
            value={formState.tags}
            onChange={handleInputChange}
            placeholder="ai, automation, email"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_public"
            name="is_public"
            checked={formState.is_public}
            onChange={handleSwitchChange}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="is_public">Make this workflow public</Label>
        </div>
      </div>
      
      <div className="pt-4 flex justify-end">
        <Button onClick={handleSave}>
          Save Settings
        </Button>
      </div>
    </div>
  );
}
