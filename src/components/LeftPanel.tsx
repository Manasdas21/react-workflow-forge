
import React from 'react';
import { MessageSquare, Database, Cpu, FileOutput } from 'lucide-react';

interface DraggableItem {
  id: string;
  type: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const draggableItems: DraggableItem[] = [
  {
    id: 'user-query',
    type: 'userQuery',
    label: 'User Query',
    icon: MessageSquare,
    description: 'Captures user input and starts the workflow'
  },
  {
    id: 'knowledge-base',
    type: 'knowledgeBase',
    label: 'Knowledge Base',
    icon: Database,
    description: 'Retrieves relevant information from your data sources'
  },
  {
    id: 'llm-engine',
    type: 'llmEngine',
    label: 'LLM Engine',
    icon: Cpu,
    description: 'Processes information using AI language models'
  },
  {
    id: 'output',
    type: 'output',
    label: 'Output',
    icon: FileOutput,
    description: 'Formats and delivers the final response'
  }
];

const LeftPanel: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType, label }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Component Library</h2>
        <p className="text-sm text-gray-600 mt-1">Drag components to the canvas</p>
      </div>
      
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {draggableItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-move hover:bg-gray-100 hover:border-gray-300 transition-all duration-200"
              draggable
              onDragStart={(e) => onDragStart(e, item.type, item.label)}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <IconComponent className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500">
          💡 Tip: Connect components by dragging from output handles to input handles
        </p>
      </div>
    </div>
  );
};

export default LeftPanel;
