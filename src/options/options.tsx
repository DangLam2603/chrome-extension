import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/globals.css';

interface Settings {
  extensionEnabled: boolean;
  autoMinimize: boolean;
  showNotifications: boolean;
  theme: 'light' | 'dark';
  keyboardShortcut: string;
}

const OptionsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    extensionEnabled: true,
    autoMinimize: false,
    showNotifications: true,
    theme: 'light',
    keyboardShortcut: 'Ctrl+Shift+E'
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load settings from storage
    chrome.storage.sync.get([
      'extensionEnabled',
      'autoMinimize', 
      'showNotifications',
      'theme',
      'keyboardShortcut'
    ], (result) => {
      setSettings({
        extensionEnabled: result.extensionEnabled ?? true,
        autoMinimize: result.autoMinimize ?? false,
        showNotifications: result.showNotifications ?? true,
        theme: result.theme ?? 'light',
        keyboardShortcut: result.keyboardShortcut ?? 'Ctrl+Shift+E'
      });
    });
  }, []);

  const saveSettings = () => {
    chrome.storage.sync.set(settings, () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  const resetSettings = () => {
    const defaultSettings: Settings = {
      extensionEnabled: true,
      autoMinimize: false,
      showNotifications: true,
      theme: 'light',
      keyboardShortcut: 'Ctrl+Shift+E'
    };
    
    setSettings(defaultSettings);
    chrome.storage.sync.set(defaultSettings, () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Extension Options</h1>
          <p className="text-gray-600">Configure your Chrome extension settings and preferences</p>
        </div>

        {/* Settings Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="space-y-8">
            {/* General Settings */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">General Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Enable Extension</label>
                    <p className="text-xs text-gray-500">Turn the extension on or off globally</p>
                  </div>
                  <button
                    onClick={() => updateSetting('extensionEnabled', !settings.extensionEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.extensionEnabled ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.extensionEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Auto-minimize Widget</label>
                    <p className="text-xs text-gray-500">Automatically minimize the widget after 30 seconds</p>
                  </div>
                  <button
                    onClick={() => updateSetting('autoMinimize', !settings.autoMinimize)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.autoMinimize ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.autoMinimize ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Show Notifications</label>
                    <p className="text-xs text-gray-500">Display browser notifications for important events</p>
                  </div>
                  <button
                    onClick={() => updateSetting('showNotifications', !settings.showNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.showNotifications ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.showNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Appearance</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <select
                    value={settings.theme}
                    onChange={(e) => updateSetting('theme', e.target.value as 'light' | 'dark')}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Keyboard Shortcuts</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Toggle Widget</label>
                  <input
                    type="text"
                    value={settings.keyboardShortcut}
                    onChange={(e) => updateSetting('keyboardShortcut', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Ctrl+Shift+E"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current shortcut: <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">{settings.keyboardShortcut}</kbd>
                  </p>
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Management</h2>
              
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-yellow-800 mb-2">Reset All Settings</h3>
                  <p className="text-xs text-yellow-700 mb-3">
                    This will reset all extension settings to their default values. This action cannot be undone.
                  </p>
                  <button
                    onClick={resetSettings}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded text-sm transition-colors"
                  >
                    Reset to Defaults
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Settings are automatically saved when changed
              </div>
              <div className="flex items-center space-x-3">
                {saved && (
                  <span className="text-sm text-green-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Saved!
                  </span>
                )}
                <button
                  onClick={saveSettings}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Extension Version 1.0.0 • 
            <a href="#" className="text-blue-500 hover:text-blue-600 ml-1">Report Issues</a>
          </p>
        </div>
      </div>
    </div>
  );
};

// Render the options page
const container = document.getElementById('options-root');
if (container) {
  const root = createRoot(container);
  root.render(<OptionsPage />);
}