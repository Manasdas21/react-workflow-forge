
import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { FileOutput } from 'lucide-react';
import { NodeData } from '../../stores/useWorkflowStore';

const OutputNode: React.FC<NodeProps<NodeData>> = ({ data, selected }) => {
  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg bg-white border-2 min-w-[180px] ${
      selected ? 'border-blue-500' : 'border-gray-200'
    }`}>
      <div className="flex items-center space-x-2">
        <div className="p-1.5 bg-orange-100 rounded">
          <FileOutput className="w-4 h-4 text-orange-600" />
        </div>
        <div>
          <div className="font-medium text-sm text-gray-900">{data.label}</div>
          <div className="text-xs text-gray-500">Final Result</div>
        </div>
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-orange-500 border-2 border-white"
      />
    </div>
  );
};

export default OutputNode;
