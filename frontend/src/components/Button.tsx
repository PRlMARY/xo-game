import React from 'react';

interface ButtonProps {
    children: string;
    variant?: 'teal' | 'blue' | 'rose' | 'default';
    onClick?: () => void;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'default',
    onClick,
    className = ''
}) => {
    const getVariantClasses = () => {
        switch (variant) {
            case 'teal':
                return 'bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-500 hover:to-teal-700 border-teal-400 hover:shadow-teal-500/30';
            case 'blue':
                return 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 border-blue-400 hover:shadow-blue-500/30';
            case 'rose':
                return 'bg-gradient-to-r from-rose-600 to-rose-800 hover:from-rose-500 hover:to-rose-700 border-rose-400 hover:shadow-rose-500/30';
            default:
                return 'bg-gradient-to-r from-neutral-600 to-neutral-800 hover:from-neutral-500 hover:to-neutral-700 border-neutral-400 hover:shadow-neutral-500/30';
        }
    };

    return (
        <button
            onClick={onClick}
            className={`${getVariantClasses()} text-white font-bold py-4 px-6 text-2xl border-4 transition-all duration-200 transform hover: hover:shadow-lg ${className}`}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
            <span className="relative flex items-center justify-center gap-2">
                {children}
            </span>
        </button>
    );
};

export { Button };
export type { ButtonProps };