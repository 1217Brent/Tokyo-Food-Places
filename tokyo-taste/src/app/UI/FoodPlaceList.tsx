"use client";

import { JSX } from "react";
import { FoodPlaceCard } from "./FoodPlaceCard";

interface FoodPlaceListProps {
  foodplaces: google.maps.places.PlaceResult[];
  handleSelectCoordinates: (coordinates: google.maps.LatLngLiteral) => void;
}

function FoodPlaceList({ foodplaces, handleSelectCoordinates }: FoodPlaceListProps): JSX.Element {
  return (
    <div className="flex overflow-x-auto w-full">
      <div className="flex flex-nowrap gap-6 min-w-fit">
        {foodplaces?.map((foodplace, idx) => (
          <FoodPlaceCard
            key={idx}
            foodplace={{
              place_id: foodplace.place_id || "",
              name: foodplace.name || "",
              image: (foodplace.photos && foodplace.photos[0]?.getUrl()) || "",
              description: foodplace.vicinity || "",
              link: foodplace.place_id
                ? `https://www.google.com/maps/place/?q=place_id:${foodplace.place_id}`
                : "",
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
