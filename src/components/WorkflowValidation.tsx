
import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, Play } from 'lucide-react';
import { useWorkflowStore } from '../stores/useWorkflowStore';
import { validateWorkflow, getExecutionOrder } from '../services/workflowValidation';
import { Button } from './ui/button';

const WorkflowValidation: React.FC = () => {
  const { nodes, edges, executeWorkflow } = useWorkflowStore();
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  const handleValidate = () => {
    const result = validateWorkflow(nodes, edges);
    setValidationResult(result);
    setShowValidation(true);
  };

  const handleExecute = async () => {
    const result = validateWorkflow(nodes, edges);
    
    if (!result.isValid) {
      setValidationResult(result);
      setShowValidation(true);
      return;
    }

    // If valid, proceed with execution
    const executionOrder = getExecutionOrder(nodes, edges);
    console.log('Executing workflow in order:', executionOrder.map(n => n.data.label));
    
    // For demo purposes, execute with a sample query
    await executeWorkflow('Test query from workflow validation');
    setShowValidation(false);
  };

  const getValidationIcon = () => {
    if (!validationResult) return <Play className="w-4 h-4" />;
    
    if (!validationResult.isValid) {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
    
    if (validationResult.warnings.length > 0) {
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
    
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const getValidationText = () => {
    if (!validationResult) return 'Build Stack';
    
    if (!validationResult.isValid) {
      return `${validationResult.errors.length} Error${validationResult.errors.length !== 1 ? 's' : ''}`;
    }
    
    if (validationResult.warnings.length > 0) {
      return `${validationResult.warnings.length} Warning${validationResult.warnings.length !== 1 ? 's' : ''}`;
    }
    
    return 'Valid';
  };

  return (
    <div className="relative">
      <div className="flex space-x-2">
        <Button
          onClick={handleValidate}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          {getValidationIcon()}
          <span>{getValidationText()}</span>
        </Button>
        
        <Button
          onClick={handleExecute}
          size="sm"
          disabled={nodes.length === 0}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
        >
          <Play className="w-4 h-4" />
          <span>Chat with Stack</span>
        </Button>
      </div>

      {showValidation && validationResult && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Workflow Validation</h3>
            <button
              onClick={() => setShowValidation(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-3">
            {validationResult.errors.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="font-medium text-red-700">Errors</span>
                </div>
                <ul className="space-y-1 text-sm">
                  {validationResult.errors.map((error, index) => (
                    <li key={index} className="text-red-600 pl-4">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {validationResult.warnings.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium text-yellow-700">Warnings</span>
                </div>
                <ul className="space-y-1 text-sm">
                  {validationResult.warnings.map((warning, index) => (
                    <li key={index} className="text-yellow-600 pl-4">
                      • {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {validationResult.isValid && validationResult.warnings.length === 0 && (
              <div className="flex items-center space-x-2 text-green-700">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">Workflow is valid and ready to execute!</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowValidation;
