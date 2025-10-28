import React from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/globals.css';
import { AppProvider } from '../context/AppContext';
import SidePanelApp from './SidePanelApp';

const SidePanel: React.FC = () => {
  return (
    <AppProvider>
      <SidePanelApp />
    </AppProvider>
  );
};

// Render the side panel
const container = document.getElementById('sidepanel-root');
if (container) {
  const root = createRoot(container);
  root.render(<SidePanel />);
}