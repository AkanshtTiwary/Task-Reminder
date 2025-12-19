import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authService.login({ email, password });
            setUser(response.user);
            return { success: true, data: response };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Login failed' 
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            setUser(response.user);
            return { success: true, data: response };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Registration failed' 
            };
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const updateProfile = async (userData) => {
        try {
            const response = await authService.updateProfile(userData);
            setUser(response.user);
            return { success: true, data: response };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Update failed' 
            };
        }
    };

    const value = {
        user,
        login,
        register,
        logout,
        updateProfile,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};