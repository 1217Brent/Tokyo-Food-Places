"use client";

import { JSX } from "react";
import { FoodPlaceCardProps } from "../dataTypes/FoodCardProps";
import Image from "next/image";

export function FoodPlaceCard({
  foodplace,
  handleCoordsChange,
}: FoodPlaceCardProps): JSX.Element {
  const { name, image, description, link } = foodplace;

  return (
    <div
      onClick={handleCoordsChange}
      className="relative flex flex-col my-6 bg-slate-800 shadow-lg rounded-xl w-96 cursor-pointer
                 transition-transform duration-300 ease-in-out hover:scale-[1.03] hover:shadow-cyan-500/50"
    >
      <div className="relative h-56 m-2.5 overflow-hidden rounded-lg ring-1 ring-cyan-600/40">
        <Image
          src={image}
          alt={name}
          fill
          style={{ objectFit: "cover" }}
          priority
          className="rounded-lg"
        />
      </div>
      <div className="p-4">
        <h6 className="mb-2 text-cyan-400 text-xl font-semibold truncate drop-shadow-md">
          {name}
        </h6>
        <p className="text-slate-300 leading-relaxed font-light line-clamp-3">
          {description}
        </p>
      </div>
      <div className="px-4 pb-4 pt-0 mt-2">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-block rounded-md bg-cyan-600 py-2 px-4 border border-transparent text-center text-sm text-white
                     shadow-md transition-all duration-200 hover:shadow-lg hover:bg-white hover:text-cyan-700
                     focus:bg-cyan-700 focus:shadow-none active:bg-cyan-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        >
          Read more
        </a>
      </div>
    </div>
  );
}
