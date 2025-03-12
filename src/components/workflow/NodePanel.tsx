
import React from 'react';
import { Bot, GitBranch, FileJson, Timer, MessageSquare, Database, Calendar, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

type NodeCategory = {
  title: string;
  nodes: {
    type: string;
    label: string;
    description: string;
    icon: React.ReactNode;
  }[];
};

const nodeCategories: NodeCategory[] = [
  {
    title: 'Triggers',
    nodes: [
      {
        type: 'trigger',
        label: 'Webhook',
        description: 'Start on HTTP request',
        icon: <Timer className="w-4 h-4 text-workflow-node-trigger" />,
      },
      {
        type: 'trigger',
        label: 'Schedule',
        description: 'Time-based trigger',
        icon: <Calendar className="w-4 h-4 text-workflow-node-trigger" />,
      },
    ],
  },
  {
    title: 'AI Models',
    nodes: [
      {
        type: 'ai',
        label: 'OpenAI',
        description: 'Process with GPT',
        icon: <Bot className="w-4 h-4 text-workflow-node-ai" />,
      },
      {
        type: 'ai',
        label: 'Google AI',
        description: 'Process with Gemini',
        icon: <Bot className="w-4 h-4 text-workflow-node-ai" />,
      },
    ],
  },
  {
    title: 'Logic',
    nodes: [
      {
        type: 'condition',
        label: 'If Condition',
        description: 'Branch workflow',
        icon: <GitBranch className="w-4 h-4 text-workflow-node-condition" />,
      },
      {
        type: 'condition',
        label: 'Switch',
        description: 'Multiple branches',
        icon: <GitBranch className="w-4 h-4 text-workflow-node-condition" />,
      },
    ],
  },
  {
    title: 'Actions',
    nodes: [
      {
        type: 'action',
        label: 'API Request',
        description: 'Call external API',
        icon: <FileJson className="w-4 h-4 text-workflow-node-action" />,
      },
      {
        type: 'action',
        label: 'Send Email',
        description: 'Send email notification',
        icon: <Mail className="w-4 h-4 text-workflow-node-action" />,
      },
      {
        type: 'action',
        label: 'Database',
        description: 'Store or retrieve data',
        icon: <Database className="w-4 h-4 text-workflow-node-action" />,
      },
    ],
  },
];

export function NodePanel() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="space-y-4">
      {nodeCategories.map((category) => (
        <div key={category.title} className="space-y-2">
          <h4 className="text-xs uppercase text-muted-foreground font-medium">{category.title}</h4>
          <div className="grid grid-cols-1 gap-2">
            {category.nodes.map((node) => (
              <Button
                key={`${node.type}-${node.label}`}
                variant="outline"
                className="flex items-center gap-2 justify-start h-auto py-2 px-3 text-left cursor-grab"
                draggable
                onDragStart={(event) => onDragStart(event, node.type)}
              >
                <div className={`p-1 rounded-md bg-workflow-node-${node.type}/10`}>
                  {node.icon}
                </div>
                <div className="flex flex-col gap-0 items-start">
                  <span className="text-xs font-medium">{node.label}</span>
                  <span className="text-[10px] text-muted-foreground">{node.description}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
