import { useState } from "react";
import { UserIcon, BotIcon } from "../assets/Icons";
import { Button } from "./Button";

interface SwitchProps {
    onChange: (value: boolean) => void;
}

export default function Switch({ onChange }: SwitchProps) {
    const [isSelected, setSelected] = useState(false);
    return (
        <div className="flex flex-row items-center gap-4">
            <Button
                variant={isSelected ? 'blue' : 'rose'}
                onClick={() => {
                    setSelected(!isSelected);
                    onChange(!isSelected);
                }}
            >
                {isSelected ? <UserIcon /> : <BotIcon />}
            </Button>
            <p className="text-white select-none text-2xl">{isSelected ? "PvP" : "PvE"}</p>
        </div>
    );
};