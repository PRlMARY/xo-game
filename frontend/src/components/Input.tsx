import { Input as HeroInput } from "@heroui/input";

export default function Input({ 
  label, 
  type, 
  value, 
  min,
  onChange,
  required,
  disabled = false,
}: { 
  label: string; 
  type: string; 
  value: string; 
  min?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
}) {

  return (
    <HeroInput
      type={type}
      label={label}
      value={value}
      min={min}
      onChange={onChange}
      variant="underlined"
      isRequired={required}
      isDisabled={disabled}
      classNames={{
        input: [
            "!text-white",
            "text-[22px]",
            "group-data-[filled=true]:text-teal-500",
        ],
        inputWrapper: [
            "border-b-2 border-white",
            "after:border-b-2 after:border-teal-500",
            "group-data-[filled=true]:border-teal-500"
        ],
        label: [
            "text-[22px]",
            "group-hover:text-white",
            "group-data-[focused=true]:text-teal-500",
            "group-data-[filled=true]:text-teal-500",
            "group-data-[focused=true]:text-[22px]",
            "group-data-[filled=true]:text-[22px]",
        ],
      }}
    />
  );
}