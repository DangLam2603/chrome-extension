import React, { useEffect, useState } from 'react';
import { authService } from '../../services/auth-service';
import { CognitoUserInfo } from '../../types';

interface UserProfileProps {
    collapsed?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ collapsed = false }) => {
    const [user, setUser] = useState<CognitoUserInfo | null>(null);
    const [showMenu, setShowMenu] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        loadUserInfo();
    }, []);

    const loadUserInfo = async () => {
        const userInfo = await authService.getCurrentUser();
        setUser(userInfo);
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await authService.logout();
            // The page will reload or redirect after logout
        } catch (error) {
            console.error('Logout failed:', error);
            setIsLoggingOut(false);
        }
    };

    if (!user) {
        return null;
    }

    const displayName = user.name || user.given_name || user.email?.split('@')[0] || 'User';
    const initials = displayName.substring(0, 2).toUpperCase();

    if (collapsed) {
        return (
            <div className="relative">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium hover:bg-blue-700 transition-colors"
                    title={displayName}
                >
                    {initials}
                </button>
                {showMenu && (
                    <div className="absolute bottom-full left-0 mb-2 w-48 bg-gray-700 rounded-lg shadow-lg border border-gray-600 overflow-hidden">
                        <div className="p-3 border-b border-gray-600">
                            <p className="text-sm font-medium text-white truncate">{displayName}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-600 transition-colors flex items-center space-x-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>{isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}</span>
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium flex-shrink-0">
                    {initials}
                </div>
                <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-white truncate">{displayName}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {showMenu && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-700 rounded-lg shadow-lg border border-gray-600 overflow-hidden">
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-gray-600 transition-colors flex items-center space-x-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>{isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
