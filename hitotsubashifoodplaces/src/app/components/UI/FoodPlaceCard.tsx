"use client";

import { JSX, MouseEventHandler } from "react";
import { FoodPlace } from "../dataTypes/FoodPlace";

type FoodCardProps = {
  foodplace: Omit<FoodPlace, "id" | "coordinates">;
  handleCoordsChange: MouseEventHandler<HTMLDivElement>;
};

export function FoodPlaceCard({ foodplace, handleCoordsChange }: FoodCardProps): JSX.Element {
  const { name, image, description, link } = foodplace;

  return (
    <div
      onClick={handleCoordsChange}
      className="relative flex flex-col my-6 bg-[#800000] shadow-sm rounded-lg w-96 cursor-pointer"
    >
      <div className="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
        <img
          src={image}
          alt={name}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h6 className="mb-2 text-white text-xl font-semibold truncate">
          {name}
        </h6>
        <p className="text-gray-300 leading-normal font-light line-clamp-3">
          {description}
        </p>
      </div>
      <div className="px-4 pb-4 pt-0 mt-2">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-md bg-gray py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-red-800 focus:shadow-none active:bg-blue-800 hover:bg-red-800 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          onClick={(e) => e.stopPropagation()}
        >
          Read more
        </a>
      </div>
    </div>
  );
}
