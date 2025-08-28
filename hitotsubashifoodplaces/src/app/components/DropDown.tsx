import { JSX } from "react";

interface DropDownProps {
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  multiple?: boolean;
  value?: string | string[];
}

function DropDown({
  handleChange,
  multiple = false,
  value,
}: DropDownProps): JSX.Element {
  return (
    <div className="relative w-full">
      <select
        onChange={handleChange}
        value={value?.[0] ?? ""}
        className="w-full h-14 bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-700 text-base font-medium shadow-sm appearance-none focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 cursor-pointer hover:border-gray-400"
      >
        <option value="ALL">All Cuisines</option>
        <option value="italian">Italian</option>
        <option value="japanese">Japanese</option>
        <option value="chinese">Chinese</option>
        <option value="french">French</option>
        <option value="Korean">Korean</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="cafe">Cafe</option>
      </select>
      
      {/* Custom dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

export default DropDown;