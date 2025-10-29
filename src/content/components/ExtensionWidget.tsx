import React, { useState, useEffect } from 'react';

interface ExtensionWidgetProps {
  onClose: () => void;
}

const ExtensionWidget: React.FC<ExtensionWidgetProps> = ({ onClose }) => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'analytics' | 'settings'>('dashboard');
  const [extensionEnabled, setExtensionEnabled] = useState(true);

  useEffect(() => {
    // Load initial settings from storage
    chrome.storage.sync.get(['extensionEnabled'], (result) => {
      setExtensionEnabled(result.extensionEnabled ?? true);
    });

    // Listen for storage changes
    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.extensionEnabled) {
        setExtensionEnabled(changes.extensionEnabled.newValue);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  const toggleExtension = () => {
    chrome.runtime.sendMessage({ type: 'TOGGLE_EXTENSION' }, (response) => {
      setExtensionEnabled(response.enabled);
    });
  };

  if (isMinimized) {
    return (
      <div className="chrome-extension-container w-12 h-12">
        <button
          onClick={() => setIsMinimized(false)}
          className="w-full h-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="chrome-extension-container w-80 max-h-96 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Extension Panel</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mt-3">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'analytics', label: 'Analytics', icon: '📈' },
            { id: 'settings', label: 'Settings', icon: '⚙️' }
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`px-3 py-1 rounded text-sm transition-colors ${activeSection === section.id
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
            >
              <span className="mr-1">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 bg-white max-h-64 overflow-y-auto">
        {activeSection === 'dashboard' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">42</div>
                <div className="text-sm text-gray-600">Active Sessions</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>

            <div className="border-t pt-3">
              <h3 className="font-medium text-gray-800 mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-2 hover:bg-gray-50 rounded transition-colors">
                  🔍 Analyze Current Page
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-50 rounded transition-colors">
                  📋 Export Data
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-50 rounded transition-colors">
                  🔄 Refresh Stats
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'analytics' && (
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📈</div>
              <h3 className="font-medium text-gray-800 mb-2">Analytics Dashboard</h3>
              <p className="text-sm text-gray-600 mb-4">
                Track your browsing patterns and extension usage
              </p>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">Pages Visited Today</span>
                  <span className="font-medium">127</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">Time Saved</span>
                  <span className="font-medium">2.5 hrs</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">Actions Performed</span>
                  <span className="font-medium">34</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Extension Settings</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Enable Extension</span>
                  <button
                    onClick={toggleExtension}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${extensionEnabled ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${extensionEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Auto-minimize</span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Show notifications</span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t">
                <button className="w-full bg-red-50 text-red-600 py-2 px-3 rounded text-sm hover:bg-red-100 transition-colors">
                  Reset All Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExtensionWidget;