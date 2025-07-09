
import { create } from 'zustand';
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

export interface ChatMessage {
  id: string;
  type: 'user' | 'system';
  content: string;
  timestamp: Date;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
}

export interface NodeData extends Record<string, unknown> {
  label: string;
  type: string;
  config?: Record<string, any>;
}

interface WorkflowState {
  nodes: Node<NodeData>[];
  edges: Edge[];
  selectedNode: Node<NodeData> | null;
  chatMessages: ChatMessage[];
  uploadedFiles: UploadedFile[];
  isExecuting: boolean;
  
  // Actions
  setNodes: (nodes: Node<NodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: any[]) => void;
  onEdgesChange: (changes: any[]) => void;
  onConnect: (connection: Connection) => void;
  setSelectedNode: (node: Node<NodeData> | null) => void;
  updateNodeConfig: (nodeId: string, config: Record<string, any>) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  addUploadedFile: (file: Omit<UploadedFile, 'id' | 'uploadedAt'>) => void;
  removeUploadedFile: (fileId: string) => void;
  executeWorkflow: (userInput: string) => Promise<void>;
  clearChat: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  chatMessages: [],
  uploadedFiles: [],
  isExecuting: false,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  
  onNodesChange: (changes) => {
    const { nodes } = get();
    set({ nodes: applyNodeChanges(changes, nodes) });
  },
  
  onEdgesChange: (changes) => {
    const { edges } = get();
    set({ edges: applyEdgeChanges(changes, edges) });
  },
  
  onConnect: (connection) => {
    const { edges } = get();
    set({ edges: addEdge(connection, edges) });
  },
  
  setSelectedNode: (node) => set({ selectedNode: node }),
  
  updateNodeConfig: (nodeId, config) => {
    const { nodes } = get();
    const updatedNodes = nodes.map(node => 
      node.id === nodeId 
        ? { ...node, data: { ...node.data, config: { ...(node.data.config || {}), ...config } } }
        : node
    );
    set({ nodes: updatedNodes });
  },
  
  addChatMessage: (message) => {
    const { chatMessages } = get();
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    set({ chatMessages: [...chatMessages, newMessage] });
  },

  addUploadedFile: (file) => {
    const { uploadedFiles } = get();
    const newFile: UploadedFile = {
      ...file,
      id: Date.now().toString(),
      uploadedAt: new Date(),
    };
    set({ uploadedFiles: [...uploadedFiles, newFile] });
  },

  removeUploadedFile: (fileId) => {
    const { uploadedFiles } = get();
    set({ uploadedFiles: uploadedFiles.filter(file => file.id !== fileId) });
  },
  
  executeWorkflow: async (userInput: string) => {
    const { addChatMessage } = get();
    set({ isExecuting: true });
    
    // Add user message
    addChatMessage({ type: 'user', content: userInput });
    
    // Simulate workflow execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock LLM response
    const mockResponse = `I've processed your request: "${userInput}". This is a simulated response from the workflow execution. In a real implementation, this would flow through your configured nodes (UserQuery → KnowledgeBase → LLMEngine → Output).`;
    
    addChatMessage({ type: 'system', content: mockResponse });
    set({ isExecuting: false });
  },
  
  clearChat: () => set({ chatMessages: [] }),
}));
