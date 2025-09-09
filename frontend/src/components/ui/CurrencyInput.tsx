import { Input } from "@/components/ui/input";

// Utility: Format number with commas
function formatWithCommas(value: string | number): string {
  if (!value) return "";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Utility: Clean formatted input back to number
function cleanNumber(value: string): string {
  return value.replace(/,/g, "").replace(/[^\d.]/g, "");
}

interface CurrencyInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  currency: string;
}

export default function CurrencyInput({
  label,
  value,
  onChange,
  placeholder = "25,000,000",
  className = "",
  currency
}: CurrencyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = cleanNumber(e.target.value);
    const formattedValue = formatWithCommas(rawValue);
    onChange(formattedValue);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      <Input
        type="text"
        value={`${currency} ${value}`}
        onChange={handleChange}
        placeholder={`${currency} ${placeholder}`}
        className="w-full"
      />
    </div>
  );
}
