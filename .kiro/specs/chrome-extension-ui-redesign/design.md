# Chrome Extension UI Redesign - Design Document

## Overview

This design document outlines the architecture and implementation approach for redesigning the Chrome extension with a sophisticated three-panel layout. The new design transforms the simple floating widget into a comprehensive side panel interface with dedicated sections for ChatBox, MCP Management, and Auto-Connect functionality.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Chrome Extension                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │    Left     │  │      Main       │  │     Right       │  │
│  │ Navigation  │  │    Content      │  │   Sidebar       │  │
│  │   Sidebar   │  │     Area        │  │  (Contextual)   │  │
│  └─────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
SidePanelApp
├── LeftNavigation
│   ├── NavItem (ChatBox)
│   ├── NavItem (MCP Management)
│   └── NavItem (Auto-Connect)
├── MainContent
│   ├── ChatBoxSection
│   ├── MCPManagementSection
│   └── AutoConnectSection
└── RightSidebar (conditional)
    └── LatestSources (ChatBox only)
```

## Components and Interfaces

### 1. Layout Components

#### LeftNavigation Component
```typescript
interface LeftNavigationProps {
  activeSection: 'chatbox' | 'mcp' | 'autoconnect';
  onSectionChange: (section: string) => void;
  isCollapsed?: boolean;
}

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  tooltip: string;
}
```

**Responsibilities:**
- Render navigation items with icons and tooltips
- Handle section switching
- Maintain active state visual indicators
- Support collapse/expand functionality

#### MainContent Component
```typescript
interface MainContentProps {
  activeSection: string;
  hasRightSidebar: boolean;
}
```

**Responsibilities:**
- Render the appropriate section component based on active selection
- Adjust layout based on right sidebar presence
- Handle section-specific data loading

#### RightSidebar Component
```typescript
interface RightSidebarProps {
  visible: boolean;
  content: 'sources' | 'none';
}

interface SourceItem {
  id: string;
  name: string;
  type: 'document' | 'file' | 'web' | 'chat';
  timestamp: Date;
  size?: string;
  icon: string;
}
```

### 2. Section Components

#### ChatBoxSection Component
```typescript
interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  sources?: SourceItem[];
}

interface ChatBoxSectionProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}
```

**Features:**
- Message history display with proper styling
- Message input with send functionality
- Support for Vietnamese language
- Integration with latest sources sidebar
- Message persistence

#### MCPManagementSection Component
```typescript
interface MCPConnection {
  id: string;
  name: string;
  type: 'local-files' | 'sharepoint' | 'confluence' | 'google-drive' | 'notion' | 'slack';
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync: Date;
  description: string;
  icon: string;
  settings: Record<string, any>;
}

interface MCPManagementSectionProps {
  connections: MCPConnection[];
  onAddConnection: () => void;
  onToggleConnection: (id: string) => void;
  onConfigureConnection: (id: string) => void;
  onDeleteConnection: (id: string) => void;
}
```

**Features:**
- Grid layout of MCP connection cards
- Status indicators with visual feedback
- Add new connection modal
- Connection management actions
- Real-time status updates

#### AutoConnectSection Component
```typescript
interface AutoConnectRule {
  id: string;
  name: string;
  description: string;
  type: 'translation' | 'content-writer' | 'data-analysis';
  status: 'active' | 'inactive';
  trigger: {
    type: 'url-pattern' | 'content-type' | 'schedule';
    value: string;
  };
  action: {
    type: string;
    config: Record<string, any>;
  };
  lastRun?: Date;
}

interface AutoConnectSectionProps {
  rules: AutoConnectRule[];
  onCreateRule: () => void;
  onToggleRule: (id: string) => void;
  onEditRule: (id: string) => void;
  onDeleteRule: (id: string) => void;
}
```

**Features:**
- List view of automation rules
- Rule creation and editing
- Toggle switches for enable/disable
- Rule execution status and history

## Data Models

### Storage Schema

```typescript
interface ExtensionStorage {
  // UI State
  activeSection: string;
  leftNavCollapsed: boolean;
  
  // Chat Data
  chatMessages: ChatMessage[];
  chatSources: SourceItem[];
  
  // MCP Data
  mcpConnections: MCPConnection[];
  mcpSettings: Record<string, any>;
  
  // Auto-Connect Data
  autoConnectRules: AutoConnectRule[];
  
  // User Preferences
  theme: 'dark' | 'light';
  language: 'en' | 'vi';
}
```

### State Management

Using React Context for global state management:

```typescript
interface AppState {
  ui: {
    activeSection: string;
    leftNavCollapsed: boolean;
    rightSidebarVisible: boolean;
  };
  chat: {
    messages: ChatMessage[];
    sources: SourceItem[];
    isLoading: boolean;
  };
  mcp: {
    connections: MCPConnection[];
    isLoading: boolean;
  };
  autoConnect: {
    rules: AutoConnectRule[];
    isLoading: boolean;
  };
}
```

## Error Handling

### Error Boundaries
- Wrap each major section in error boundaries
- Graceful degradation when sections fail to load
- User-friendly error messages with retry options

### Connection Error Handling
- MCP connection failures with retry mechanisms
- Offline state detection and handling
- Timeout handling for long-running operations

### Data Persistence Errors
- Chrome storage quota exceeded handling
- Storage corruption recovery
- Backup and restore mechanisms

## Testing Strategy

### Unit Testing
- Component rendering tests for all major components
- State management logic testing
- Utility function testing
- Mock Chrome APIs for testing

### Integration Testing
- Section switching functionality
- Data persistence across browser sessions
- MCP connection management
- Auto-connect rule execution

### E2E Testing
- Complete user workflows
- Cross-browser compatibility
- Performance testing with large datasets
- Accessibility testing

## Performance Considerations

### Optimization Strategies
- Lazy loading of section components
- Virtual scrolling for large message/connection lists
- Debounced search and filtering
- Efficient re-rendering with React.memo

### Memory Management
- Cleanup of event listeners
- Proper disposal of MCP connections
- Message history pruning
- Cache management for sources

### Bundle Size Optimization
- Code splitting by sections
- Tree shaking for unused utilities
- Optimized icon imports
- Compressed assets

## Accessibility

### WCAG Compliance
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

### Internationalization
- Vietnamese language support
- RTL layout considerations
- Cultural date/time formatting
- Localized error messages

## Security Considerations

### Data Protection
- Secure storage of sensitive MCP credentials
- Message encryption for sensitive conversations
- Secure communication with external services
- User data privacy protection

### Content Security Policy
- Strict CSP for extension pages
- Safe handling of user-generated content
- XSS prevention in chat messages
- Secure iframe handling for external content

## Migration Strategy

### From Current Widget
1. Preserve existing user settings and data
2. Migrate storage schema gradually
3. Provide fallback for unsupported features
4. User notification of new features

### Backward Compatibility
- Support for existing Chrome storage data
- Graceful handling of missing data fields
- Version detection and migration scripts