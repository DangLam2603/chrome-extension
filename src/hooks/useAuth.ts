import { useState, useEffect } from 'react';
import { isAuthenticated, getUserInfo, signOut as authSignOut, UserInfo } from '../utils/auth';

export function useAuth() {
    const [isAuthChecking, setIsAuthChecking] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<UserInfo | null>(null);

    const checkAuth = async () => {
        setIsAuthChecking(true);
        try {
            const authenticated = await isAuthenticated();
            setIsLoggedIn(authenticated);

            if (authenticated) {
                const userInfo = await getUserInfo();
                setUser(userInfo);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setIsLoggedIn(false);
            setUser(null);
        } finally {
            setIsAuthChecking(false);
        }
    };

    useEffect(() => {
        checkAuth();

        // Listen for auth changes from storage
        const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
            if (changes.isAuthenticated) {
                checkAuth();
            }
        };

        chrome.storage.onChanged.addListener(handleStorageChange);

        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };
    }, []);

    const signOut = async () => {
        await authSignOut();
        setIsLoggedIn(false);
        setUser(null);
    };

    return {
        isAuthChecking,
        isLoggedIn,
        user,
        signOut,
        refreshAuth: checkAuth,
    };
}
