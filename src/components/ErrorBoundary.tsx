import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="h-screen bg-gray-900 flex items-center justify-center p-8">
                    <div className="max-w-2xl w-full bg-gray-800 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                            <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h2 className="text-xl font-semibold text-white">Application Error</h2>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-300 mb-2">Something went wrong. Please try reloading the extension.</p>
                        </div>

                        <details className="mb-4">
                            <summary className="cursor-pointer text-blue-400 hover:text-blue-300 mb-2">
                                Show error details
                            </summary>
                            <div className="bg-gray-900 rounded p-4 overflow-auto max-h-96">
                                <p className="text-red-400 font-mono text-sm mb-2">
                                    {this.state.error?.toString()}
                                </p>
                                {this.state.errorInfo && (
                                    <pre className="text-gray-400 text-xs overflow-auto">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                )}
                            </div>
                        </details>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                Reload Extension
                            </button>
                            <button
                                onClick={() => {
                                    chrome.storage.local.clear();
                                    window.location.reload();
                                }}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                            >
                                Clear Storage & Reload
                            </button>
                        </div>

                        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
                            <p className="text-yellow-400 text-sm">
                                <strong>Debug tip:</strong> Open DevTools (right-click → Inspect) to see more details in the Console tab.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
