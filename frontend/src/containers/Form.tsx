import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { ArrowLeftIcon } from '../assets/Icons';
import Input from '../components/Input';
import { useAuth } from '../contexts/AuthContext';
import { FormErrors } from '../types/auth';

interface FormProps {
    formType: 'signin' | 'signup';
    onBack: () => void;
}

const Form: React.FC<FormProps> = ({ formType, onBack }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentForm, setCurrentForm] = useState(formType);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, signup, isLoading, error, clearError, isAuthenticated } = useAuth();

    useEffect(() => {
        clearError();
        setErrors({});
    }, [currentForm, clearError]);

    useEffect(() => {
        if (isAuthenticated) {
            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setErrors({});
            clearError();
            onBack();
        }
    }, [isAuthenticated, onBack, clearError]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!username.trim()) {
            newErrors.username = 'Username is required';
        } else if (username.length < 5) {
            newErrors.username = 'Username must be at least 5 characters';
        } else if (username.length > 20) {
            newErrors.username = 'Username must be less than 20 characters';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (currentForm === 'signup') {
            if (!confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
            } else if (password !== confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSwitch = (formType: 'signin' | 'signup') => {
        setCurrentForm(formType);
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setErrors({});
        clearError();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        clearError();

        try {
            if (currentForm === 'signin') {
                await login(username.trim(), password);
            } else {
                await signup(username.trim(), password);
            }
        } catch (error) {
            console.error('Authentication error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-start space-y-4 min-w-65 min-h-105">
            <div className="flex justify-between w-full">
                <button
                    onClick={onBack}
                    className="text-white hover:text-gray-300 transition-colors items-center"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-6xl font-bold text-white">
                    {currentForm === 'signin' ? 'Sign In' : 'Sign Up'}
                </h1>
            </div>
            {error && (
                <div className="w-full p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-1">
                    <Input
                        type="username"
                        label="Username"
                        value={username}
                        required
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoading || isSubmitting}
                    />
                    {errors.username && (
                        <p className="text-red-400 text-xs ml-1">{errors.username}</p>
                    )}
                </div>
                
                <div className="flex flex-col gap-1">
                    <Input
                        type="password"
                        label="Password"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading || isSubmitting}
                    />
                    {errors.password && (
                        <p className="text-red-400 text-xs ml-1">{errors.password}</p>
                    )}
                </div>
                
                {currentForm === 'signup' && (
                    <div className="flex flex-col gap-1">
                        <Input
                            type="password"
                            label="Confirm Password"
                            value={confirmPassword}
                            required
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading || isSubmitting}
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-400 text-xs ml-1">{errors.confirmPassword}</p>
                        )}
                    </div>
                )}
                
                <Button 
                    variant="teal" 
                    className="mt-4" 
                    type="submit"
                    disabled={isLoading || isSubmitting}
                >
                    {isLoading || isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            {currentForm === 'signin' ? 'Signing In...' : 'Signing Up...'}
                        </div>
                    ) : (
                        currentForm === 'signin' ? 'Sign In' : 'Sign Up'
                    )}
                </Button>
            </form>
            <div className="text-center">
                <p className="text-gray-400 text-md">
                    {currentForm === 'signin' ? (
                        <>Don't have an account? <button
                            onClick={() => handleFormSwitch('signup')}
                            className="text-teal-500 hover:text-teal-300 transition-colors cursor-pointer"
                        >
                            Sign Up
                        </button></>
                    ) : (
                        <>Already have an account? <button
                            onClick={() => handleFormSwitch('signin')}
                            className="text-teal-500 hover:text-teal-300 transition-colors cursor-pointer"
                        >
                            Sign In
                        </button></>
                    )}
                </p>
            </div>
        </div>
    );
};

export default Form;
