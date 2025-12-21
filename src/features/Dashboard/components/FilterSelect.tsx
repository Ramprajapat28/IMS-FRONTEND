import { ChevronDown } from "lucide-react";

type FilterSelectProps = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

const FilterSelect: React.FC<FilterSelectProps> = ({
  value,
  options,
  onChange,
}) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          appearance-none
          border border-gray-300
          rounded-lg
          px-4 py-2 pr-10
          text-sm
          bg-white
          cursor-pointer
          focus:outline-none
          focus:ring-2 focus:ring-blue-600
          w-full
        "
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {/* Chevron Icon */}
      <ChevronDown
        size={16}
        className="absolute right-3 top-5 -translate-y-1/2 text-gray-500 pointer-events-none"
      />
    </div>
  );
};

export default FilterSelect;
