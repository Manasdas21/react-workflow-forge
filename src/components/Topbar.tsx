
import React from 'react';
import { Workflow, Play, RotateCcw } from 'lucide-react';
import { useWorkflowStore } from '../stores/useWorkflowStore';

const Topbar: React.FC = () => {
  const { clearChat, nodes, edges } = useWorkflowStore();

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <Workflow className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900">Workflow Builder</h1>
        </div>
        <div className="text-sm text-gray-500">
          {nodes.length} nodes • {edges.length} connections
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <button 
          onClick={clearChat}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Clear Chat</span>
        </button>
        
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Play className="w-4 h-4" />
          <span>Run Workflow</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
