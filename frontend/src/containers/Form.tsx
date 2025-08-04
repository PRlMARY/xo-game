import React, { useState } from 'react';
import { Button } from '../components/Button';
import { ArrowLeftIcon } from '../assets/Icons';
import Input from '../components/Input';

interface FormProps {
    formType: 'signin' | 'signup';
    onBack: () => void;
}

const Form: React.FC<FormProps> = ({ formType, onBack }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentForm, setCurrentForm] = useState(formType);

    const handleFormSwitch = (formType: 'signin' | 'signup') => {
        setCurrentForm(formType);
        setUsername('');
        setPassword('');
        setConfirmPassword('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(`${currentForm} submitted:`, { username, password, confirmPassword });
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
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                <Input
                    type="username"
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                    type="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {currentForm === 'signup' && (
                    <Input
                        type="password"
                        label="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                )}
                <Button variant="teal" className="mt-4" onClick={() => { }} >
                    {currentForm === 'signin' ? 'Sign In' : 'Sign Up'}
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
