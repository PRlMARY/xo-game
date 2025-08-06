import React from 'react';
import { PlayIcon, PauseIcon, PrevIcon, NextIcon, ChevronLeftIcon, ChevronRightIcon } from '@/assets/Icons';

interface ReplayControlsProps {
    isPlaying: boolean;
    isAtStart: boolean;
    isAtEnd: boolean;
    speed: number;
    onPlay: () => void;
    onPause: () => void;
    onStart: () => void;
    onEnd: () => void;
    onNextMove: () => void;
    onPreviousMove: () => void;
    onSpeedChange: (speed: number) => void;
}

const ReplayControls: React.FC<ReplayControlsProps> = ({
    isPlaying,
    isAtStart,
    isAtEnd,
    speed,
    onPlay,
    onPause,
    onStart,
    onEnd,
    onNextMove,
    onPreviousMove,
    onSpeedChange
}) => {
    const speedOptions = [
        { label: '0.5x', value: 2000 },
        { label: '1x', value: 1000 },
        { label: '2x', value: 500 },
        { label: '3x', value: 333 }
    ];

    return (
        <div className="w-full flex flex-col items-center space-y-4">
            <div className="flex items-center">
                <button
                    onClick={onStart}
                    disabled={isAtStart}
                    className="p-2 text-white hover:text-teal-400 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                    title="Go to Start"
                >
                    <PrevIcon />
                </button>

                <button
                    onClick={onPreviousMove}
                    disabled={isAtStart}
                    className="p-2 text-white hover:text-teal-400 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                    title="Previous Move"
                >
                    <ChevronLeftIcon />
                </button>

                <button
                    onClick={isPlaying ? onPause : onPlay}
                    disabled={isAtEnd}
                    className="p-3 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-full transition-colors"
                    title={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? (
                        <PauseIcon />
                    ) : (
                        <PlayIcon />
                    )}
                </button>

                <button
                    onClick={onNextMove}
                    disabled={isAtEnd}
                    className="p-2 text-white hover:text-teal-400 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                    title="Next Move"
                >
                    <ChevronRightIcon />
                </button>

                <button
                    onClick={onEnd}
                    disabled={isAtEnd}
                    className="p-2 text-white hover:text-teal-400 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                    title="Go to End"
                >
                    <NextIcon />
                </button>
            </div>

            <div className="flex items-center space-x-2">
                <span className="text-white text-sm">Speed:</span>
                {speedOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onSpeedChange(option.value)}
                        className={`px-2 py-1 text-xs transition-colors ${speed === option.value
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ReplayControls;
