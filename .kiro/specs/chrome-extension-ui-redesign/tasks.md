# Implementation Plan

- [x] 1. Set up new component architecture and layout system


  - Create the main three-panel layout structure with proper CSS Grid/Flexbox
  - Implement responsive design system for different panel widths
  - Set up TypeScript interfaces for all major data structures
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 2. Implement Left Navigation Sidebar


- [ ] 2.1 Create LeftNavigation component with navigation items







  - Build navigation component with three main sections (ChatBox, MCP, Auto-Connect)
  - Implement active state management and visual indicators
  - Add hover effects and tooltips for navigation items
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 2.2 Add navigation icons and dark theme styling
  - Design and implement consistent icon system for navigation
  - Apply dark theme styling matching the provided mockups
  - Implement collapsible sidebar functionality
  - _Requirements: 1.5, 1.6, 6.1, 6.2_


- [ ] 3. Build ChatBox Section with three-panel layout
- [ ] 3.1 Create ChatBox main interface and message system

  - Implement chat message display with proper message bubbles
  - Create message input field with send functionality
  - Add support for Vietnamese language text rendering
  - Build conversation history with scrollable container
  - _Requirements: 2.1, 2.3, 2.4, 2.8_

- [ ] 3.2 Implement Right Sidebar for Latest Sources
  - Create LatestSources component for the right sidebar
  - Display source items with icons, names, and timestamps
  - Implement different source types (documents, files, etc.)
  - Add proper styling and layout for source list
  - _Requirements: 2.2, 2.5, 2.6_

- [ ] 3.3 Add chat message persistence and state management
  - Implement Chrome storage integration for chat history
  - Create message sending and receiving logic
  - Add loading states and error handling for chat operations
  - _Requirements: 2.7, 7.2_

- [ ] 4. Create MCP Management Section
- [ ] 4.1 Build MCP connection cards grid layout
  - Create MCPConnection component with card-based design
  - Implement grid layout for multiple MCP connections
  - Add connection status indicators (Connected, Disconnected, Syncing)
  - Display service names, descriptions, and last sync times
  - _Requirements: 3.1, 3.2, 3.3, 3.6_

- [ ] 4.2 Implement MCP connection management functionality
  - Create "Add Connection" modal with form inputs
  - Add action buttons for settings and disconnection
  - Implement connection status management and updates
  - Support different MCP types (Local Files, SharePoint, etc.)
  - _Requirements: 3.4, 3.5, 3.7_

- [ ] 4.3 Add MCP data persistence and real-time updates
  - Integrate Chrome storage for MCP connection data
  - Implement connection status monitoring and updates
  - Add error handling for failed connections
  - _Requirements: 7.3_

- [ ] 5. Develop Auto-Connect Section
- [ ] 5.1 Create automation rule cards and list interface
  - Build AutoConnectRule component with card layout
  - Display rule names, descriptions, and status indicators
  - Implement Active/Inactive status with visual feedback
  - Add rule configuration and management buttons
  - _Requirements: 4.1, 4.2, 4.5, 4.6_

- [ ] 5.2 Implement rule creation and management functionality
  - Create "Create New" rule modal with form inputs
  - Add toggle switches for enabling/disabling rules
  - Implement rule editing and deletion functionality
  - Support different automation types as shown in designs
  - _Requirements: 4.3, 4.4, 4.7_

- [ ] 5.3 Add automation rule persistence and execution
  - Integrate Chrome storage for automation rules
  - Implement rule execution logic and status tracking
  - Add error handling and logging for rule execution
  - _Requirements: 7.4, 7.5_

- [ ] 6. Implement state management and data persistence
- [ ] 6.1 Set up React Context for global state management
  - Create AppContext with state for all sections
  - Implement state reducers for UI, chat, MCP, and auto-connect
  - Add state persistence to Chrome storage
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 6.2 Add Chrome storage integration and data migration
  - Implement storage utilities for reading/writing extension data
  - Create data migration logic from old widget format
  - Add error handling for storage operations and quota limits
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 7. Apply consistent theming and visual design
- [ ] 7.1 Implement dark theme system across all components
  - Create comprehensive CSS variables for dark theme colors
  - Apply consistent styling to all components and sections
  - Ensure proper contrast and readability
  - _Requirements: 6.1, 6.2, 6.5_

- [ ] 7.2 Add responsive design and layout adjustments
  - Implement responsive breakpoints for different panel sizes
  - Add proper spacing, typography, and component alignment
  - Ensure UI elements remain accessible at minimum sizes
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.3, 6.4_

- [ ] 8. Update side panel entry point and routing
- [ ] 8.1 Refactor sidepanel.tsx to use new component architecture
  - Replace existing side panel content with new three-panel layout
  - Implement section routing and active state management
  - Add proper component mounting and unmounting
  - _Requirements: 1.1, 1.2, 5.1_

- [ ] 8.2 Update build configuration and dependencies
  - Ensure Vite build properly handles new component structure
  - Add any required dependencies for new functionality
  - Update TypeScript configurations for new interfaces
  - Test build output and extension loading

- [x] 9. Add AWS Cognito authentication integration
- [x] 9.1 Implement AuthService with PKCE flow
  - Created complete auth-service.ts with login, logout, token refresh
  - Integrated PKCE code generation and validation
  - Added token management and automatic refresh scheduling
  - Implemented OAuth callback handling in service worker
  - _All authentication requirements implemented_

- [x] 9.2 Create authentication UI components
  - Built AuthGuard component for protecting routes
  - Created LoginButton with loading states
  - Implemented UserProfile component with logout functionality
  - Integrated authentication into SidePanelApp
  - _Authentication UI complete and functional_

- [ ] 10. Add error handling and loading states
- [ ] 10.1 Implement error boundaries and fallback UI
  - Create error boundary components for each major section
  - Add user-friendly error messages and retry functionality
  - Implement graceful degradation for failed components
  - _Requirements: All sections need proper error handling_

- [ ] 10.2 Add loading states and skeleton screens
  - Create loading indicators for data fetching operations
  - Implement skeleton screens for better perceived performance
  - Add proper loading states for MCP connections and chat operations
  - _Requirements: All sections need loading state management_

- [ ] 11. Testing and quality assurance
- [ ] 11.1 Create unit tests for major components
  - Write tests for LeftNavigation, ChatBox, MCP, and AutoConnect components
  - Test state management and data persistence logic
  - Add tests for utility functions and data transformations
  - Test authentication flow and token management
  - _Requirements: All components need proper test coverage_

- [ ] 11.2 Perform integration testing and bug fixes
  - Test section switching and state persistence
  - Verify Chrome storage integration works correctly
  - Test responsive design across different panel sizes
  - Test authentication flow end-to-end
  - Fix any bugs discovered during testing
  - _Requirements: All requirements need integration testing_