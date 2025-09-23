"use client";

import React, { JSX } from "react";

type SearchBarProps = {
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function SearchBar<T extends SearchBarProps>({ onSearch }: T): JSX.Element {
  return (
    <div className="relative w-full">
      <input
        type="text"
        onChange={onSearch}
        placeholder="Search restaurants..."
        className="w-full h-14 bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-700 text-base font-medium shadow-sm appearance-none focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 cursor-text hover:border-gray-400"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}