type DropDownProps = {
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function DropDown({ value, handleChange }: DropDownProps) {
  return (
    <select value={value} onChange={handleChange} className="...">
      <option value="hitotsubashi">Hitotsubashi</option>
      <option value="waseda">Waseda</option>
      <option value="keio">Keio</option>
    </select>
  );
}
