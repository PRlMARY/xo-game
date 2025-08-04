import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { AuthState, AuthContextType, User } from '../types/auth';
import { apiService } from '../services/api';

type AuthAction =
    | { type: 'AUTH_START' }
    | { type: 'AUTH_SUCCESS'; payload: User }
    | { type: 'AUTH_ERROR'; payload: string }
    | { type: 'AUTH_LOGOUT' }
    | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'AUTH_START':
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case 'AUTH_SUCCESS':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        case 'AUTH_ERROR':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload,
            };
        case 'AUTH_LOGOUT':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const login = useCallback(async (username: string, password: string): Promise<void> => {
        dispatch({ type: 'AUTH_START' });
        try {
            const response = await apiService.login({ username, password });
            if (response.success && response.user) {
                dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
                // Store user data in localStorage for persistence
                localStorage.setItem('user', JSON.stringify(response.user));
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
            throw error;
        }
    }, []);

    const signup = useCallback(async (username: string, password: string): Promise<void> => {
        dispatch({ type: 'AUTH_START' });
        try {
            const response = await apiService.signup({ username, password });
            if (response.success && response.user) {
                dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
                // Store user data in localStorage for persistence
                localStorage.setItem('user', JSON.stringify(response.user));
            } else {
                throw new Error(response.message || 'Signup failed');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Signup failed';
            dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
            throw error;
        }
    }, []);

    const logout = useCallback((): void => {
        dispatch({ type: 'AUTH_LOGOUT' });
        localStorage.removeItem('user');
    }, []);

    const clearError = useCallback((): void => {
        dispatch({ type: 'CLEAR_ERROR' });
    }, []);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                dispatch({ type: 'AUTH_SUCCESS', payload: user });
            } catch (error) {
                console.error('Failed to parse stored user data:', error);
                localStorage.removeItem('user');
            }
        }
    }, []);

    const value: AuthContextType = {
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        error: state.error,
        login,
        signup,
        logout,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
