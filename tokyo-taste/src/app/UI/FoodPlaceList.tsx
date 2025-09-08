// FoodPlaceList.tsx
"use client";

import { JSX } from "react";
import { FoodPlaceCard } from "./FoodPlaceCard";
import { FoodPlace } from "../dataTypes/FoodPlace";
import { FoodCardProps } from "../dataTypes/FoodCardProps";


interface FoodPlaceListProps {
  foodplaces: google.maps.places.PlaceResult[];
  handleSelectCoordinates: (coordinates: google.maps.LatLngLiteral) => void;
}

function FoodPlaceList({ foodplaces, handleSelectCoordinates }: FoodPlaceListProps): JSX.Element {
  return (
    <div className="overflow-x-auto w-full">
      <div className="flex flex-nowrap gap-6 px-4 py-2 min-w-fit">
        {foodplaces?.map((foodplace) => (
          <FoodPlaceCard
            key={foodplace.place_id}
            foodplace={{
              place_id: foodplace.place_id || "",
              name: foodplace.name || "",
              image: (foodplace.photos && foodplace.photos[0]?.getUrl()) || "",
              description: foodplace.vicinity || "",
              link: foodplace.url || "",
            }}
            handleCoordsChange={() => {
              const coords = foodplace.geometry?.location;
              if (coords) {
                handleSelectCoordinates({ lat: coords.lat(), lng: coords.lng() });
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default FoodPlaceList;
