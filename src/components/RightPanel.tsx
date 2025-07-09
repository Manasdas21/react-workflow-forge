
import React from 'react';
import { Settings, X } from 'lucide-react';
import { useWorkflowStore } from '../stores/useWorkflowStore';
import { NodeData } from '../stores/useWorkflowStore';

const RightPanel: React.FC = () => {
  const { selectedNode, updateNodeConfig, setSelectedNode } = useWorkflowStore();

  const renderConfigForm = () => {
    if (!selectedNode) {
      return (
        <div className="text-center py-12">
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Node Selected</h3>
          <p className="text-gray-600">Click on a node to configure its properties</p>
        </div>
      );
    }

    const nodeData = selectedNode.data as NodeData;
    const config = nodeData.config || {};

    switch (nodeData.type) {
      case 'userQuery':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Placeholder
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your question..."
                value={config.placeholder || ''}
                onChange={(e) => updateNodeConfig(selectedNode.id, { placeholder: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Input Length
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={config.maxLength || 500}
                onChange={(e) => updateNodeConfig(selectedNode.id, { maxLength: parseInt(e.target.value) })}
              />
            </div>
          </div>
        );

      case 'knowledgeBase':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Source
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={config.dataSource || 'documents'}
                onChange={(e) => updateNodeConfig(selectedNode.id, { dataSource: e.target.value })}
              >
                <option value="documents">Document Store</option>
                <option value="database">SQL Database</option>
                <option value="api">External API</option>
                <option value="vector">Vector Database</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Limit
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={config.searchLimit || 5}
                onChange={(e) => updateNodeConfig(selectedNode.id, { searchLimit: parseInt(e.target.value) })}
              />
            </div>
          </div>
        );

      case 'llmEngine':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Provider
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={config.provider || 'OpenAI'}
                onChange={(e) => updateNodeConfig(selectedNode.id, { provider: e.target.value })}
              >
                <option value="OpenAI">OpenAI GPT</option>
                <option value="Anthropic">Anthropic Claude</option>
                <option value="Google">Google Gemini</option>
                <option value="Local">Local Model</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={config.model || 'gpt-4'}
                onChange={(e) => updateNodeConfig(selectedNode.id, { model: e.target.value })}
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3">Claude 3</option>
                <option value="gemini-pro">Gemini Pro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                className="w-full"
                value={config.temperature || 0.7}
                onChange={(e) => updateNodeConfig(selectedNode.id, { temperature: parseFloat(e.target.value) })}
              />
              <div className="text-sm text-gray-500 mt-1">
                Current: {config.temperature || 0.7}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                System Prompt
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="You are a helpful assistant..."
                value={config.systemPrompt || ''}
                onChange={(e) => updateNodeConfig(selectedNode.id, { systemPrompt: e.target.value })}
              />
            </div>
          </div>
        );

      case 'output':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output Format
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={config.format || 'text'}
                onChange={(e) => updateNodeConfig(selectedNode.id, { format: e.target.value })}
              >
                <option value="text">Plain Text</option>
                <option value="markdown">Markdown</option>
                <option value="json">JSON</option>
                <option value="html">HTML</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="includeMetadata"
                checked={config.includeMetadata || false}
                onChange={(e) => updateNodeConfig(selectedNode.id, { includeMetadata: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="includeMetadata" className="text-sm text-gray-700">
                Include metadata
              </label>
            </div>
          </div>
        );

      default:
        return <div className="text-gray-500">No configuration available for this node type.</div>;
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {selectedNode ? 'Node Configuration' : 'Properties'}
        </h2>
        {selectedNode && (
          <button
            onClick={() => setSelectedNode(null)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {selectedNode && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-2">{(selectedNode.data as NodeData).label}</h3>
            <p className="text-sm text-gray-600 mb-4">
              Node ID: {selectedNode.id}
            </p>
          </div>
        )}
        
        {renderConfigForm()}
      </div>
    </div>
  );
};

export default RightPanel;
