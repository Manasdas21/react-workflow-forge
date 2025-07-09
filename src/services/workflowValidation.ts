
import { Node, Edge } from '@xyflow/react';
import { NodeData } from '../stores/useWorkflowStore';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ValidationError {
  nodeId?: string;
  message: string;
  type: 'error' | 'warning';
}

export const validateWorkflow = (
  nodes: Node<NodeData>[],
  edges: Edge[]
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if we have at least one node
  if (nodes.length === 0) {
    errors.push('Workflow must contain at least one node');
    return { isValid: false, errors, warnings };
  }

  // Check for required node types
  const nodeTypes = nodes.map(node => node.data.type);
  const hasUserQuery = nodeTypes.includes('userQuery');
  const hasOutput = nodeTypes.includes('output');

  if (!hasUserQuery) {
    errors.push('Workflow must include a User Query node as the starting point');
  }

  if (!hasOutput) {
    errors.push('Workflow must include an Output node as the ending point');
  }

  // Validate individual node configurations
  nodes.forEach(node => {
    const config = node.data.config || {};
    
    switch (node.data.type) {
      case 'llmEngine':
        if (!config.provider) {
          warnings.push(`LLM Engine node "${node.data.label}" should have a provider selected`);
        }
        if (!config.systemPrompt) {
          warnings.push(`LLM Engine node "${node.data.label}" should have a system prompt configured`);
        }
        break;
        
      case 'knowledgeBase':
        if (!config.source) {
          warnings.push(`Knowledge Base node "${node.data.label}" should have a data source selected`);
        }
        if (config.source === 'files' && (!config.selectedFiles || config.selectedFiles.length === 0)) {
          warnings.push(`Knowledge Base node "${node.data.label}" has files selected as source but no files are chosen`);
        }
        break;
        
      case 'userQuery':
        if (!config.template) {
          warnings.push(`User Query node "${node.data.label}" should have a query template configured`);
        }
        break;
    }
  });

  // Validate connections and flow logic
  const nodeConnections = new Map<string, { incoming: number; outgoing: number }>();
  
  // Initialize connection counts
  nodes.forEach(node => {
    nodeConnections.set(node.id, { incoming: 0, outgoing: 0 });
  });

  // Count connections
  edges.forEach(edge => {
    if (nodeConnections.has(edge.source)) {
      nodeConnections.get(edge.source)!.outgoing++;
    }
    if (nodeConnections.has(edge.target)) {
      nodeConnections.get(edge.target)!.incoming++;
    }
  });

  // Validate connection logic
  nodes.forEach(node => {
    const connections = nodeConnections.get(node.id)!;
    
    switch (node.data.type) {
      case 'userQuery':
        if (connections.outgoing === 0) {
          errors.push(`User Query node "${node.data.label}" must connect to at least one other node`);
        }
        if (connections.incoming > 0) {
          warnings.push(`User Query node "${node.data.label}" typically shouldn't have incoming connections`);
        }
        break;
        
      case 'output':
        if (connections.incoming === 0) {
          errors.push(`Output node "${node.data.label}" must have at least one incoming connection`);
        }
        if (connections.outgoing > 0) {
          warnings.push(`Output node "${node.data.label}" typically shouldn't have outgoing connections`);
        }
        break;
        
      case 'knowledgeBase':
      case 'llmEngine':
        if (connections.incoming === 0) {
          warnings.push(`${node.data.label} should have incoming connections to receive data`);
        }
        if (connections.outgoing === 0) {
          warnings.push(`${node.data.label} should have outgoing connections to pass data forward`);
        }
        break;
    }
  });

  // Check for disconnected nodes (isolated components)
  const connectedNodes = new Set<string>();
  edges.forEach(edge => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });

  const disconnectedNodes = nodes.filter(node => !connectedNodes.has(node.id));
  if (disconnectedNodes.length > 0 && nodes.length > 1) {
    disconnectedNodes.forEach(node => {
      warnings.push(`Node "${node.data.label}" is not connected to the workflow`);
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const getExecutionOrder = (nodes: Node<NodeData>[], edges: Edge[]): Node<NodeData>[] => {
  // Simple topological sort to determine execution order
  const inDegree = new Map<string, number>();
  const adjList = new Map<string, string[]>();
  
  // Initialize
  nodes.forEach(node => {
    inDegree.set(node.id, 0);
    adjList.set(node.id, []);
  });
  
  // Build adjacency list and calculate in-degrees
  edges.forEach(edge => {
    adjList.get(edge.source)?.push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
  });
  
  // Topological sort
  const queue: string[] = [];
  const result: Node<NodeData>[] = [];
  
  // Start with nodes that have no incoming edges
  inDegree.forEach((degree, nodeId) => {
    if (degree === 0) {
      queue.push(nodeId);
    }
  });
  
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const currentNode = nodes.find(n => n.id === currentId);
    if (currentNode) {
      result.push(currentNode);
    }
    
    adjList.get(currentId)?.forEach(neighborId => {
      const newDegree = (inDegree.get(neighborId) || 0) - 1;
      inDegree.set(neighborId, newDegree);
      
      if (newDegree === 0) {
        queue.push(neighborId);
      }
    });
  }
  
  return result;
};
