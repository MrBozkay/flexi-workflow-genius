
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  MarkerType,
  BackgroundVariant,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodeTypes } from './NodeTypes';
import { Button } from '@/components/ui/button';
import { Plus, Save, Play, ZoomIn, ZoomOut } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NodePanel } from './NodePanel';
import { SettingsPanel } from './SettingsPanel';
import { Workflow } from '@/hooks/useWorkflows';

export interface WorkflowCanvasProps {
  workflow: Workflow;
  onWorkflowChange: React.Dispatch<React.SetStateAction<Workflow>>;
  initialNodes?: any[];
  initialEdges?: any[];
  onNodesChange?: (nodes: any[]) => void;
  onEdgesChange?: (edges: any[]) => void;
}

// Initial demo nodes
const demoNodes = [
  {
    id: 'trigger-1',
    type: 'trigger',
    position: { x: 250, y: 100 },
    data: { 
      label: 'Webhook', 
      description: 'Start on HTTP request' 
    },
  },
  {
    id: 'ai-1',
    type: 'ai',
    position: { x: 500, y: 100 },
    data: { 
      label: 'OpenAI', 
      description: 'Process with GPT-4' 
    },
  },
  {
    id: 'condition-1',
    type: 'condition',
    position: { x: 750, y: 100 },
    data: { 
      label: 'Check Sentiment', 
      description: 'Positive or Negative?' 
    },
  },
  {
    id: 'action-positive',
    type: 'action',
    position: { x: 1000, y: 0 },
    data: { 
      label: 'Success', 
      description: 'Handle positive outcome' 
    },
  },
  {
    id: 'action-negative',
    type: 'action',
    position: { x: 1000, y: 200 },
    data: { 
      label: 'Failure', 
      description: 'Handle negative outcome' 
    },
  },
];

// Initial demo edges
const demoEdges = [
  {
    id: 'e-trigger-ai',
    source: 'trigger-1',
    target: 'ai-1',
    animated: true,
    style: { strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e-ai-condition',
    source: 'ai-1',
    target: 'condition-1',
    animated: true,
    style: { strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e-condition-positive',
    source: 'condition-1',
    sourceHandle: 'outputTrue',
    target: 'action-positive',
    animated: true,
    label: 'True',
    labelStyle: { fill: '#10b981', fontWeight: 500 },
    style: { stroke: '#10b981', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e-condition-negative',
    source: 'condition-1',
    sourceHandle: 'outputFalse',
    target: 'action-negative',
    animated: true,
    label: 'False',
    labelStyle: { fill: '#ef4444', fontWeight: 500 },
    style: { stroke: '#ef4444', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
];

export function WorkflowCanvas({ 
  workflow,
  onWorkflowChange,
  initialNodes = [], 
  initialEdges = [],
  onNodesChange,
  onEdgesChange
}: WorkflowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  // Use workflow data instead of demo data
  const startingNodes = workflow?.nodes?.length > 0 ? workflow.nodes : 
                        initialNodes.length > 0 ? initialNodes : demoNodes;
  const startingEdges = workflow?.edges?.length > 0 ? workflow.edges : 
                        initialEdges.length > 0 ? initialEdges : demoEdges;
  
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(startingNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(startingEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  // Update workflow when nodes or edges change
  useEffect(() => {
    if (workflow && onWorkflowChange) {
      onWorkflowChange({
        ...workflow,
        nodes,
        edges
      });
    }
  }, [nodes, edges, workflow, onWorkflowChange]);
  
  // Call onNodesChange prop when nodes change
  useEffect(() => {
    if (onNodesChange) {
      onNodesChange(nodes);
    }
  }, [nodes, onNodesChange]);
  
  // Call onEdgesChange prop when edges change
  useEffect(() => {
    if (onEdgesChange) {
      onEdgesChange(edges);
    }
  }, [edges, onEdgesChange]);
  
  // Update nodes and edges when workflow changes from outside
  useEffect(() => {
    if (workflow?.nodes && workflow.nodes.length > 0) {
      setNodes(workflow.nodes);
    }
    if (workflow?.edges && workflow.edges.length > 0) {
      setEdges(workflow.edges);
    }
  }, [workflow?.id, setNodes, setEdges]);
  
  const handleNodesChange = useCallback((changes: any) => {
    onNodesChangeInternal(changes);
  }, [onNodesChangeInternal]);
  
  const handleEdgesChange = useCallback((changes: any) => {
    onEdgesChangeInternal(changes);
  }, [onEdgesChangeInternal]);
  
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        defaultEdgeOptions={{
          animated: true,
          style: { strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        }}
      >
        <Controls 
          position="bottom-right"
          className="!bg-card border !border-border !shadow-md"
        />

        <Background 
          gap={24} 
          size={1} 
          color="#94a3b8" 
          variant={BackgroundVariant.Dots}
          className="bg-background" 
        />

        <Panel position="top-right" className="glass-panel w-80 max-h-[80vh] overflow-auto">
          {selectedNode && (
            <Tabs defaultValue="settings">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="inspect">Inspect</TabsTrigger>
              </TabsList>
              <TabsContent value="settings" className="mt-2">
                <SettingsPanel nodeId={selectedNode} nodes={nodes} setNodes={setNodes} />
              </TabsContent>
              <TabsContent value="inspect" className="mt-2">
                <div className="p-3">
                  <h3 className="text-sm font-medium mb-2">Node Data</h3>
                  <pre className="bg-muted p-2 rounded-md overflow-auto text-xs font-mono">
                    {JSON.stringify(
                      nodes.find(node => node.id === selectedNode)?.data,
                      null, 2
                    )}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </Panel>

        <Panel position="bottom-left" className="glass-panel">
          <div className="p-4">
            <h3 className="text-sm font-medium mb-3">Available Nodes</h3>
            <div className="grid grid-cols-2 gap-2">
              <NodePanel />
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
