
import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Database } from 'lucide-react';
import { NodeData } from '../../stores/useWorkflowStore';

const KnowledgeBaseNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as NodeData;
  
  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg bg-white border-2 min-w-[180px] ${
      selected ? 'border-blue-500' : 'border-gray-200'
    }`}>
      <div className="flex items-center space-x-2">
        <div className="p-1.5 bg-purple-100 rounded">
          <Database className="w-4 h-4 text-purple-600" />
        </div>
        <div>
          <div className="font-medium text-sm text-gray-900">{nodeData.label}</div>
          <div className="text-xs text-gray-500">Data Retrieval</div>
        </div>
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-purple-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-purple-500 border-2 border-white"
      />
    </div>
  );
};

export default KnowledgeBaseNode;
