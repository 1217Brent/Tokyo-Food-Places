"use client";

import { JSX } from "react";
import { FoodPlaceCardProps } from "../dataTypes/FoodCardProps";
import Image from "next/image";

export function FoodPlaceCard({
  foodplace,
  handleCoordsChange,
}: FoodPlaceCardProps): JSX.Element {
  const { name, image, description, place_id } = foodplace;
  const url = `https://www.google.com/maps/place/?q=place_id:${place_id}`;

  return (
    <div
      onClick={handleCoordsChange}
      className="relative flex flex-col my-6 bg-blue-700 shadow-sm rounded-lg w-96 cursor-pointer"
    >
      <div className="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
        <div className="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
          <Image
            src={image}
            alt={name}
            layout="fill" 
            objectFit="cover"
            priority 
            className="rounded-md"
          />
        </div>
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
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-md bg-blue-500 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg hover:bg-white hover:text-blue-700 focus:bg-blue-600 focus:shadow-none active:bg-blue-600 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          onClick={(e) => e.stopPropagation()}
        >
          Read more
        </a>
      </div>
    </div>
  );
}
