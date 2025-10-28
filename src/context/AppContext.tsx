import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, SectionType, ChatMessage, MCPConnection, AutoConnectRule, SourceItem } from '../types';

// Action types
type AppAction = 
  | { type: 'SET_ACTIVE_SECTION'; payload: SectionType }
  | { type: 'TOGGLE_LEFT_NAV' }
  | { type: 'SET_RIGHT_SIDEBAR_VISIBLE'; payload: boolean }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_CHAT_LOADING'; payload: boolean }
  | { type: 'SET_CHAT_SOURCES'; payload: SourceItem[] }
  | { type: 'SET_MCP_CONNECTIONS'; payload: MCPConnection[] }
  | { type: 'SET_MCP_LOADING'; payload: boolean }
  | { type: 'UPDATE_MCP_CONNECTION'; payload: { id: string; updates: Partial<MCPConnection> } }
  | { type: 'SET_AUTOCONNECT_RULES'; payload: AutoConnectRule[] }
  | { type: 'SET_AUTOCONNECT_LOADING'; payload: boolean }
  | { type: 'UPDATE_AUTOCONNECT_RULE'; payload: { id: string; updates: Partial<AutoConnectRule> } }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };

// Initial state
const initialState: AppState = {
  ui: {
    activeSection: 'chatbox',
    leftNavCollapsed: false,
    rightSidebarVisible: true,
  },
  chat: {
    messages: [],
    sources: [],
    isLoading: false,
  },
  mcp: {
    connections: [],
    isLoading: false,
  },
  autoConnect: {
    rules: [],
    isLoading: false,
  },
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ACTIVE_SECTION':
      return {
        ...state,
        ui: {
          ...state.ui,
          activeSection: action.payload,
          rightSidebarVisible: action.payload === 'chatbox',
        },
      };
    
    case 'TOGGLE_LEFT_NAV':
      return {
        ...state,
        ui: {
          ...state.ui,
          leftNavCollapsed: !state.ui.leftNavCollapsed,
        },
      };
    
    case 'SET_RIGHT_SIDEBAR_VISIBLE':
      return {
        ...state,
        ui: {
          ...state.ui,
          rightSidebarVisible: action.payload,
        },
      };
    
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chat: {
          ...state.chat,
          messages: [...state.chat.messages, action.payload],
        },
      };
    
    case 'SET_CHAT_LOADING':
      return {
        ...state,
        chat: {
          ...state.chat,
          isLoading: action.payload,
        },
      };
    
    case 'SET_CHAT_SOURCES':
      return {
        ...state,
        chat: {
          ...state.chat,
          sources: action.payload,
        },
      };
    
    case 'SET_MCP_CONNECTIONS':
      return {
        ...state,
        mcp: {
          ...state.mcp,
          connections: action.payload,
        },
      };
    
    case 'SET_MCP_LOADING':
      return {
        ...state,
        mcp: {
          ...state.mcp,
          isLoading: action.payload,
        },
      };
    
    case 'UPDATE_MCP_CONNECTION':
      return {
        ...state,
        mcp: {
          ...state.mcp,
          connections: state.mcp.connections.map(conn =>
            conn.id === action.payload.id
              ? { ...conn, ...action.payload.updates }
              : conn
          ),
        },
      };
    
    case 'SET_AUTOCONNECT_RULES':
      return {
        ...state,
        autoConnect: {
          ...state.autoConnect,
          rules: action.payload,
        },
      };
    
    case 'SET_AUTOCONNECT_LOADING':
      return {
        ...state,
        autoConnect: {
          ...state.autoConnect,
          isLoading: action.payload,
        },
      };
    
    case 'UPDATE_AUTOCONNECT_RULE':
      return {
        ...state,
        autoConnect: {
          ...state.autoConnect,
          rules: state.autoConnect.rules.map(rule =>
            rule.id === action.payload.id
              ? { ...rule, ...action.payload.updates }
              : rule
          ),
        },
      };
    
    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload,
      };
    
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from Chrome storage on mount
  useEffect(() => {
    chrome.storage.sync.get([
      'activeSection',
      'leftNavCollapsed',
      'chatMessages',
      'chatSources',
      'mcpConnections',
      'autoConnectRules'
    ], (result) => {
      if (result.activeSection) {
        dispatch({ type: 'LOAD_STATE', payload: {
          ui: {
            activeSection: result.activeSection || 'chatbox',
            leftNavCollapsed: result.leftNavCollapsed || false,
            rightSidebarVisible: (result.activeSection || 'chatbox') === 'chatbox',
          },
          chat: {
            messages: result.chatMessages || [],
            sources: result.chatSources || [],
            isLoading: false,
          },
          mcp: {
            connections: result.mcpConnections || [],
            isLoading: false,
          },
          autoConnect: {
            rules: result.autoConnectRules || [],
            isLoading: false,
          },
        }});
      }
    });
  }, []);

  // Save state to Chrome storage when it changes
  useEffect(() => {
    chrome.storage.sync.set({
      activeSection: state.ui.activeSection,
      leftNavCollapsed: state.ui.leftNavCollapsed,
      chatMessages: state.chat.messages,
      chatSources: state.chat.sources,
      mcpConnections: state.mcp.connections,
      autoConnectRules: state.autoConnect.rules,
    });
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};