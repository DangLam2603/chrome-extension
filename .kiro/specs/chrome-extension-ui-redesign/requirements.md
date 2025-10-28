# Chrome Extension UI Redesign Requirements

## Introduction

This specification outlines the redesign of the Chrome extension to implement a three-panel layout with a left navigation sidebar, main content area, and contextual right sidebar. The design will transform the current simple widget into a comprehensive interface with three main sections: ChatBox, MCP Management, and Auto-Connect.

## Requirements

### Requirement 1: Left Navigation Sidebar

**User Story:** As a user, I want a persistent left navigation sidebar so that I can easily switch between the three main sections of the extension.

#### Acceptance Criteria

1. WHEN the extension loads THEN the system SHALL display a left sidebar with navigation icons
2. WHEN the user clicks on a navigation item THEN the system SHALL highlight the active section
3. WHEN the user hovers over navigation items THEN the system SHALL show tooltips with section names
4. THE left sidebar SHALL contain exactly three navigation items: ChatBox, MCP Management, and Auto-Connect
5. THE left sidebar SHALL have a dark theme consistent with the provided designs
6. THE left sidebar SHALL be collapsible to maximize content area when needed

### Requirement 2: ChatBox Section with Right Sidebar

**User Story:** As a user, I want a ChatBox interface with a conversation area and a right sidebar showing latest sources so that I can have AI conversations while seeing relevant context.

#### Acceptance Criteria

1. WHEN the ChatBox section is active THEN the system SHALL display a three-panel layout (left nav, main chat, right sources)
2. WHEN in ChatBox mode THEN the system SHALL show a "Latest Sources" panel on the right side
3. THE main chat area SHALL include a message input field at the bottom
4. THE main chat area SHALL display conversation history with proper message bubbles
5. THE right sidebar SHALL show a list of recent sources with timestamps
6. THE right sidebar SHALL display source types (documents, files, etc.) with appropriate icons
7. WHEN the user sends a message THEN the system SHALL add it to the conversation history
8. THE chat interface SHALL support Vietnamese language as shown in the designs

### Requirement 3: MCP Management Section

**User Story:** As a user, I want an MCP Management interface so that I can view and manage my MCP connections and their status.

#### Acceptance Criteria

1. WHEN the MCP Management section is active THEN the system SHALL display a grid of MCP connection cards
2. EACH MCP card SHALL show the service name, connection status, and last sync time
3. THE system SHALL display connection status with visual indicators (Connected, Disconnected, Syncing)
4. WHEN the user clicks "Add Connection" THEN the system SHALL open a modal for adding new MCP connections
5. EACH MCP card SHALL include action buttons for settings and disconnection
6. THE MCP cards SHALL show service icons and descriptions
7. THE system SHALL support various MCP types: Local Files, SharePoint, Confluence, Google Drive, Notion, Slack

### Requirement 4: Auto-Connect Section

**User Story:** As a user, I want an Auto-Connect management interface so that I can configure and manage automated connection rules.

#### Acceptance Criteria

1. WHEN the Auto-Connect section is active THEN the system SHALL display a list of automation rules
2. EACH automation rule SHALL show the rule name, description, and status (Active/Inactive)
3. WHEN the user clicks "Create New" THEN the system SHALL open a form for creating automation rules
4. EACH rule card SHALL include toggle switches for enabling/disabling
5. EACH rule card SHALL show configuration and delete options
6. THE system SHALL support different automation types as shown in the design
7. THE automation rules SHALL be persistently stored and manageable

### Requirement 5: Responsive Layout System

**User Story:** As a user, I want the interface to be responsive and well-organized so that I can efficiently use the extension regardless of panel size.

#### Acceptance Criteria

1. THE layout SHALL adapt to different side panel widths
2. WHEN the right sidebar is not needed THEN the system SHALL use a two-panel layout
3. THE main content area SHALL expand to fill available space when sidebars are collapsed
4. ALL text SHALL be readable and UI elements SHALL remain accessible at minimum panel sizes
5. THE layout SHALL maintain proper spacing and alignment across all sections

### Requirement 6: Theme and Visual Consistency

**User Story:** As a user, I want a consistent dark theme across all sections so that the interface is visually cohesive and matches modern design standards.

#### Acceptance Criteria

1. THE entire interface SHALL use a dark theme with consistent color palette
2. ALL sections SHALL maintain visual consistency in typography, spacing, and component styling
3. THE system SHALL use appropriate icons and visual indicators for different content types
4. HOVER states and interactive elements SHALL provide clear visual feedback
5. THE design SHALL match the provided mockups in terms of layout, colors, and component styling

### Requirement 7: Data Persistence and State Management

**User Story:** As a user, I want my conversations, connections, and settings to persist across browser sessions so that I don't lose my work.

#### Acceptance Criteria

1. WHEN the user closes and reopens the extension THEN the system SHALL restore the last active section
2. CHAT conversations SHALL be saved and restored between sessions
3. MCP connection states SHALL persist and be restored on extension startup
4. AUTO-CONNECT rules SHALL be saved and automatically applied when appropriate
5. USER preferences and settings SHALL be maintained across browser restarts