
import React from 'react';
import { MessageSquare, Database, Bot, FileOutput } from 'lucide-react';
import { useWorkflowStore } from '../stores/useWorkflowStore';
import FileUpload from './FileUpload';

const LeftPanel: React.FC = () => {
  const { setNodes, nodes } = useWorkflowStore();

  const nodeTypes = [
    { type: 'userQuery', label: 'User Query', icon: MessageSquare, color: 'bg-green-100 text-green-600' },
    { type: 'knowledgeBase', label: 'Knowledge Base', icon: Database, color: 'bg-purple-100 text-purple-600' },
    { type: 'llmEngine', label: 'LLM Engine', icon: Bot, color: 'bg-blue-100 text-blue-600' },
    { type: 'output', label: 'Output', icon: FileOutput, color: 'bg-orange-100 text-orange-600' },
  ];

  const addNode = (type: string, label: string) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: Math.random() * 400 + 50, y: Math.random() * 300 + 50 },
      data: { label, type },
    };
    setNodes([...nodes, newNode]);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Component Library</h2>
        <p className="text-sm text-gray-600 mt-1">Drag components to canvas</p>
      </div>
      
      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        <div className="space-y-2">
          <h3 className="font-medium text-gray-700">Workflow Nodes</h3>
          {nodeTypes.map(({ type, label, icon: Icon, color }) => (
            <button
              key={type}
              onClick={() => addNode(type, label)}
              className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`p-2 rounded ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-gray-900">{label}</span>
            </button>
          ))}
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <FileUpload />
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
