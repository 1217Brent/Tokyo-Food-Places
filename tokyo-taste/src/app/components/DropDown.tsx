"use client";

import React from "react";

interface DropDownProps {
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function DropDown({ value, handleChange }: DropDownProps) {
  return (
    <select
      value={value}
      onChange={handleChange}
      className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="hitotsubashi">Hitotsubashi</option>
      <option value="waseda">Waseda</option>
      <option value="keio">Keio</option>
    </select>
  );
}
