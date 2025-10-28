// Core data types for the Chrome extension

export type SectionType = 'chatbox' | 'mcp' | 'autoconnect';

export interface ChatMessage {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    sources?: SourceItem[];
}

export interface SourceItem {
    id: string;
    name: string;
    type: 'document' | 'file' | 'web' | 'chat';
    timestamp: Date;
    size?: string;
    icon: string;
    path?: string;
}

export interface MCPConnection {
    id: string;
    name: string;
    type: 'local-files' | 'sharepoint' | 'confluence' | 'google-drive' | 'notion' | 'slack';
    status: 'connected' | 'disconnected' | 'syncing' | 'error';
    lastSync: Date;
    description: string;
    icon: string;
    settings: Record<string, any>;
}

export interface AutoConnectRule {
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

export interface ExtensionStorage {
    // UI State
    activeSection: SectionType;
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

export interface AppState {
    ui: {
        activeSection: SectionType;
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