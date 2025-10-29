import React, { useEffect, useState } from 'react';
import { authService } from '../../services/auth-service';
import { AuthState } from '../../config/auth-config';
import LoginButton from './LoginButton';

interface AuthGuardProps {
    children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>(AuthState.LOADING);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkPendingOAuth();
        checkAuthState();
    }, []);

    const checkPendingOAuth = async () => {
        try {
            const result = await chrome.storage.local.get(['oauth_pending']);
            if (result.oauth_pending) {
                const { code, state } = result.oauth_pending;
                console.log('Processing pending OAuth callback');

                // Clear the pending data
                await chrome.storage.local.remove(['oauth_pending']);

                // Process the OAuth callback
                try {
                    await authService.handleCallback(code, state);
                    setAuthState(AuthState.AUTHENTICATED);
                    setError(null);
                } catch (error) {
                    console.error('OAuth callback processing failed:', error);
                    setError('Authentication failed. Please try again.');
                    setAuthState(AuthState.UNAUTHENTICATED);
                }
            }
        } catch (error) {
            console.error('Failed to check pending OAuth:', error);
        }
    };

    const checkAuthState = async () => {
        try {
            console.log('Checking auth state...');
            const state = await authService.getAuthState();
            console.log('Auth state:', state);
            setAuthState(state);
        } catch (error) {
            console.error('Auth state check failed:', error);
            setAuthState(AuthState.ERROR);
            setError(`Failed to check authentication status: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleLoginSuccess = () => {
        setAuthState(AuthState.AUTHENTICATED);
        setError(null);
    };

    const handleLoginError = (error: Error) => {
        setError(error.message);
    };

    if (authState === AuthState.LOADING) {
        return (
            <div className="h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Đang kiểm tra xác thực...</p>
                </div>
            </div>
        );
    }

    if (authState === AuthState.UNAUTHENTICATED || authState === AuthState.ERROR) {
        return (
            <div className="h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center max-w-md p-8">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-white mb-3">Xác thực bắt buộc</h2>
                    <p className="text-gray-400 mb-6">
                        Vui lòng đăng nhập để sử dụng extension. Bạn sẽ được chuyển hướng đến trang đăng nhập AWS Cognito.
                    </p>
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}
                    <LoginButton onLoginSuccess={handleLoginSuccess} onLoginError={handleLoginError} />
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthGuard;
