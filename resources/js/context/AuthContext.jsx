/**
 * Inertia-compatible shim for the original AuthContext.
 * Original components import { useAuth } from '../../context/AuthContext'
 * This provides the same API surface but uses Inertia's shared props + session auth.
 */
import { usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export const useAuth = () => {
    const { auth } = usePage().props;
    const user = auth?.user || null;

    const login = async (username, password) => {
        return new Promise((resolve, reject) => {
            router.post('/login', { username, password }, {
                onSuccess: () => {
                    // Server redirects on success, so this resolves after redirect
                    // The page will have the user's role from the new page's props
                    resolve({ success: true, role: 'Client' });
                },
                onError: (errors) => {
                    const msg = errors.username || errors.password || 'Invalid Credentials';
                    resolve({ success: false, message: msg });
                },
                // Prevent Inertia from preserving scroll on login redirect
                preserveScroll: false,
            });
        });
    };

    const logout = () => {
        router.post('/logout');
    };

    const loading = false;

    return { user, login, logout, loading };
};

// Default export for compatibility with `import { AuthProvider } from ...`
export const AuthProvider = ({ children }) => children;
