import React, { useState } from 'react';
import { authService } from '../../services/auth-service';

interface LoginButtonProps {
    onLoginSuccess?: () => void;
    onLoginError?: (error: Error) => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onLoginSuccess, onLoginError }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            await authService.login();
            onLoginSuccess?.();
        } catch (error) {
            console.error('Login failed:', error);
            onLoginError?.(error as Error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleLogin}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
            {isLoading ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Đang đăng nhập...</span>
                </>
            ) : (
                <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Đăng nhập với AWS Cognito</span>
                </>
            )}
        </button>
    );
};

export default LoginButton;
