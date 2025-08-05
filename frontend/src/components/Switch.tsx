import { useState } from "react";
import { UserIcon, BotIcon } from "../assets/Icons";

interface SwitchProps {
    onChange: (value: boolean) => void;
}

export default function Switch({
    onChange,
}: SwitchProps) {
    const [isSelected, setSelected] = useState(false);
    const getVariantClasses = () => {
        switch (isSelected) {
            case true:
                return 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 border-blue-400 hover:shadow-blue-500/30';
            case false:
                return 'bg-gradient-to-r from-rose-600 to-rose-800 hover:from-rose-500 hover:to-rose-700 border-rose-400 hover:shadow-rose-500/30';
            default:
                return 'bg-gradient-to-r from-neutral-600 to-neutral-800 hover:from-neutral-500 hover:to-neutral-700 border-neutral-400 hover:shadow-neutral-500/30';
        }
    };
    return (

        <div className="flex flex-row items-center gap-4 w-full justify-start">
            <button
                className={`${getVariantClasses()} text-white font-bold p-2 text-2xl border-4 transition-all duration-200 transform hover: hover:shadow-lg`}
                onClick={() => {
                    setSelected(!isSelected);
                    onChange(!isSelected);
                }}
            >
                {isSelected ? <UserIcon /> : <BotIcon />}
            </button>
            <p className="text-white select-none text-2xl">{isSelected ? "PvP" : "PvE"}</p>
        </div>
    );
};
