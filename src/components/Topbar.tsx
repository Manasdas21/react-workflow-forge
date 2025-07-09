
import React from 'react';
import { Workflow, Download, Upload } from 'lucide-react';
import { useWorkflowStore } from '../stores/useWorkflowStore';
import WorkflowValidation from './WorkflowValidation';

const Topbar: React.FC = () => {
  const { nodes, edges, clearChat } = useWorkflowStore();

  const exportWorkflow = () => {
    const workflowData = {
      nodes,
      edges,
      metadata: {
        version: '1.0',
        createdAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length
      }
    };
    
    const dataStr = JSON.stringify(workflowData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importWorkflow = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const workflowData = JSON.parse(e.target?.result as string);
            // This would need to be implemented in the store
            console.log('Import workflow:', workflowData);
            alert('Import functionality would be implemented here');
          } catch (error) {
            alert('Invalid workflow file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <Workflow className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900">Workflow Builder</h1>
        </div>
        <div className="text-sm text-gray-500">
          {nodes.length} nodes, {edges.length} connections
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={importWorkflow}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Import</span>
        </button>
        
        <button
          onClick={exportWorkflow}
          disabled={nodes.length === 0}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
        
        <button
          onClick={clearChat}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
        >
          Clear Chat
        </button>
        
        <WorkflowValidation />
      </div>
    </div>
  );
};

export default Topbar;
