
import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Topbar from './components/Topbar';
import LeftPanel from './components/LeftPanel';
import FlowCanvas from './components/FlowCanvas';
import RightPanel from './components/RightPanel';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  return (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Topbar */}
        <Topbar />
        
        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Component Library */}
          <LeftPanel />
          
          {/* Center - Flow Canvas */}
          <div className="flex-1 flex flex-col">
            <FlowCanvas />
            {/* Bottom Chat */}
            <ChatInterface />
          </div>
          
          {/* Right Panel - Configuration */}
          <RightPanel />
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default App;
