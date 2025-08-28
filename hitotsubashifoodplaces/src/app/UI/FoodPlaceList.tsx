"use client";

import { JSX } from "react";
import { FoodPlaceCard } from "./FoodPlaceCard";
import { FoodPlace } from "../../dataTypes/FoodPlace";

interface foodplaceListProps {
  foodplaces: FoodPlace[];
  handleSelectCoordinates: (coordinates: FoodPlace["coordinates"]) => void;
}

function FoodPlaceList({ foodplaces, handleSelectCoordinates }: foodplaceListProps): JSX.Element {
  return (
    <div className="overflow-x-auto w-full">
      <div className="flex flex-nowrap gap-6 px-4 py-2 min-w-fit">
        {foodplaces.map((foodplace) => (
          <FoodPlaceCard
            key={foodplace.id}
            foodplace={{
              name: foodplace.name,
              image: foodplace.image,
              description: foodplace.description,
              link: foodplace.link,
            }}
            handleCoordsChange={() => handleSelectCoordinates(foodplace.coordinates)}
          />
        ))}
      </div>
    </div>
  );
}

export default FoodPlaceList;
