
import React from 'react';
import { useWorkflowStore } from '../stores/useWorkflowStore';
import { File, Image, FileText } from 'lucide-react';

const RightPanel: React.FC = () => {
  const { selectedNode, updateNodeConfig, uploadedFiles } = useWorkflowStore();

  if (!selectedNode) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="text-center py-8">
          <div className="text-gray-400 mb-3">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </div>
          <h3 className="font-medium text-gray-900 mb-2">Node Configuration</h3>
          <p className="text-sm text-gray-600">Select a node to configure its properties</p>
        </div>
      </div>
    );
  }

  const nodeData = selectedNode.data as any;

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return Image;
    if (fileType === 'application/pdf') return FileText;
    return File;
  };

  const renderNodeConfig = () => {
    switch (nodeData.type) {
      case 'userQuery':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Query Template
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter query template..."
                value={nodeData.config?.template || ''}
                onChange={(e) => updateNodeConfig(selectedNode.id, { template: e.target.value })}
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
                value={nodeData.config?.source || 'vector'}
                onChange={(e) => updateNodeConfig(selectedNode.id, { source: e.target.value })}
              >
                <option value="vector">Vector Database</option>
                <option value="files">Uploaded Files</option>
                <option value="api">External API</option>
              </select>
            </div>
            
            {nodeData.config?.source === 'files' && uploadedFiles.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Files
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {uploadedFiles.map((file) => {
                    const FileIcon = getFileIcon(file.type);
                    return (
                      <div
                        key={file.id}
                        className="flex items-center space-x-2 p-2 border border-gray-200 rounded-md hover:bg-gray-50"
                      >
                        <FileIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 truncate flex-1">
                          {file.name}
                        </span>
                        <input
                          type="checkbox"
                          className="rounded"
                          onChange={(e) => {
                            const selectedFiles = nodeData.config?.selectedFiles || [];
                            const updatedFiles = e.target.checked
                              ? [...selectedFiles, file.id]
                              : selectedFiles.filter((id: string) => id !== file.id);
                            updateNodeConfig(selectedNode.id, { selectedFiles: updatedFiles });
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );

      case 'llmEngine':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model Provider
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={nodeData.config?.provider || 'openai'}
                onChange={(e) => updateNodeConfig(selectedNode.id, { provider: e.target.value })}
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="google">Google Gemini</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                System Prompt
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Enter system prompt..."
                value={nodeData.config?.systemPrompt || ''}
                onChange={(e) => updateNodeConfig(selectedNode.id, { systemPrompt: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature: {nodeData.config?.temperature || 0.7}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                className="w-full"
                value={nodeData.config?.temperature || 0.7}
                onChange={(e) => updateNodeConfig(selectedNode.id, { temperature: parseFloat(e.target.value) })}
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
                value={nodeData.config?.format || 'text'}
                onChange={(e) => updateNodeConfig(selectedNode.id, { format: e.target.value })}
              >
                <option value="text">Plain Text</option>
                <option value="json">JSON</option>
                <option value="markdown">Markdown</option>
              </select>
            </div>
          </div>
        );

      default:
        return <p className="text-gray-500">No configuration available</p>;
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">{nodeData.label}</h3>
        <p className="text-sm text-gray-600 mt-1">Configure node properties</p>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        {renderNodeConfig()}
      </div>
    </div>
  );
};

export default RightPanel;
