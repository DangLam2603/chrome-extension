import React from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/globals.css';
import { AppProvider } from '../context/AppContext';
import SidePanelApp from './SidePanelApp';
import ErrorBoundary from '../components/ErrorBoundary';

console.log('=== Sidepanel Loading ===');
console.log('Extension ID:', chrome.runtime?.id);
console.log('Location:', window.location.href);

const SidePanel: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <SidePanelApp />
      </AppProvider>
    </ErrorBoundary>
  );
};

// Render the side panel
const container = document.getElementById('sidepanel-root');
if (container) {
  console.log('Root container found, rendering app...');
  const root = createRoot(container);
  root.render(<SidePanel />);
} else {
  console.error('Root container not found!');
}