
import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge,
} from '@xyflow/react';
import { useWorkflowStore, NodeData } from '../stores/useWorkflowStore';
import UserQueryNode from './nodes/UserQueryNode';
import KnowledgeBaseNode from './nodes/KnowledgeBaseNode';
import LLMEngineNode from './nodes/LLMEngineNode';
import OutputNode from './nodes/OutputNode';

const nodeTypes = {
  userQuery: UserQueryNode,
  knowledgeBase: KnowledgeBaseNode,
  llmEngine: LLMEngineNode,
  output: OutputNode,
};

const FlowCanvas: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { 
    nodes, 
    edges, 
    setNodes, 
    setEdges, 
    setSelectedNode,
    onConnect: storeOnConnect 
  } = useWorkflowStore();
  
  const [localNodes, setLocalNodes, onNodesChange] = useNodesState(nodes);
  const [localEdges, setLocalEdges, onEdgesChange] = useEdgesState(edges);

  // Sync local state with store
  React.useEffect(() => {
    setNodes(localNodes);
  }, [localNodes, setNodes]);

  React.useEffect(() => {
    setEdges(localEdges);
  }, [localEdges, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = addEdge(params, localEdges);
      setLocalEdges(newEdge);
      storeOnConnect(params);
    },
    [localEdges, setLocalEdges, storeOnConnect]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      try {
        const data = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const { nodeType, label } = data;

        const position = {
          x: event.clientX - reactFlowBounds.left - 100,
          y: event.clientY - reactFlowBounds.top - 50,
        };

        const newNode: Node<NodeData> = {
          id: `${nodeType}-${Date.now()}`,
          type: nodeType,
          position,
          data: { 
            label,
            type: nodeType,
            config: {}
          },
        };

        setLocalNodes((nds) => nds.concat(newNode));
      } catch (error) {
        console.error('Error parsing dropped data:', error);
      }
    },
    [setLocalNodes]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node<NodeData>) => {
      setSelectedNode(node);
    },
    [setSelectedNode]
  );

  return (
    <div className="flex-1 bg-gray-100" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={localNodes}
        edges={localEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <Controls className="bg-white shadow-lg border border-gray-200" />
        <MiniMap 
          className="bg-white shadow-lg border border-gray-200"
          nodeStrokeColor="#374151"
          nodeColor="#f3f4f6"
          nodeBorderRadius={8}
        />
        <Background color="#e5e7eb" gap={20} />
      </ReactFlow>
      
      {localNodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">Start Building Your Workflow</h3>
            <p className="text-gray-500">Drag components from the left panel to get started</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowCanvas;
