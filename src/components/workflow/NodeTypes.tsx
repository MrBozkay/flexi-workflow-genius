
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  MessageSquare, 
  Timer, 
  Bot, 
  GitBranch, 
  FileJson,
  AlertCircle
} from 'lucide-react';

export const TriggerNode = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="p-2 rounded-full bg-workflow-node-trigger/10 mb-2">
        {data.icon || <Timer className="w-5 h-5 text-workflow-node-trigger" />}
      </div>
      <div className="font-medium text-sm">{data.label || "Trigger"}</div>
      <div className="text-xs text-muted-foreground mt-1">{data.description || "Start workflow"}</div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="workflow-handle"
        id="output"
      />
    </div>
  );
};

export const AINode = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="p-2 rounded-full bg-workflow-node-ai/10 mb-2">
        {data.icon || <Bot className="w-5 h-5 text-workflow-node-ai" />}
      </div>
      <div className="font-medium text-sm">{data.label || "AI Model"}</div>
      <div className="text-xs text-muted-foreground mt-1">{data.description || "Process with AI"}</div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="workflow-handle"
        id="input"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="workflow-handle"
        id="output"
      />
    </div>
  );
};

export const ConditionNode = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="p-2 rounded-full bg-workflow-node-condition/10 mb-2">
        {data.icon || <GitBranch className="w-5 h-5 text-workflow-node-condition" />}
      </div>
      <div className="font-medium text-sm">{data.label || "Condition"}</div>
      <div className="text-xs text-muted-foreground mt-1">{data.description || "Branch workflow"}</div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="workflow-handle"
        id="input"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="workflow-handle"
        id="outputTrue"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="workflow-handle"
        id="outputFalse"
      />
    </div>
  );
};

export const ActionNode = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="p-2 rounded-full bg-workflow-node-action/10 mb-2">
        {data.icon || <FileJson className="w-5 h-5 text-workflow-node-action" />}
      </div>
      <div className="font-medium text-sm">{data.label || "Action"}</div>
      <div className="text-xs text-muted-foreground mt-1">{data.description || "Perform action"}</div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="workflow-handle"
        id="input"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="workflow-handle"
        id="output"
      />
    </div>
  );
};

export const nodeTypes = {
  trigger: TriggerNode,
  ai: AINode,
  condition: ConditionNode,
  action: ActionNode,
};
