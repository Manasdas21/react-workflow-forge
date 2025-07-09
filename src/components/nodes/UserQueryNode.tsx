
import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { MessageSquare } from 'lucide-react';
import { NodeData } from '../../stores/useWorkflowStore';

const UserQueryNode: React.FC<NodeProps<NodeData>> = ({ data, selected }) => {
  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg bg-white border-2 min-w-[180px] ${
      selected ? 'border-blue-500' : 'border-gray-200'
    }`}>
      <div className="flex items-center space-x-2">
        <div className="p-1.5 bg-green-100 rounded">
          <MessageSquare className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <div className="font-medium text-sm text-gray-900">{data.label}</div>
          <div className="text-xs text-gray-500">Entry Point</div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-green-500 border-2 border-white"
      />
    </div>
  );
};

export default UserQueryNode;
