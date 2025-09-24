"use client";

import { JSX } from "react";
import FoodPlaceCard from "./FoodPlaceCard";

interface Coords {
  lat: number;
  lng: number;
  place_id?: string;
}

interface FoodPlaceListProps {
  foodplaces: google.maps.places.PlaceResult[];
  handleSelectCoordinates: (coordinates: Coords) => void;
}

function scrollToMap(): void {
  const map = document.getElementById("map-section");
  if (map) {
    map.scrollIntoView({ behavior: "smooth" });
  }
}

function FoodPlaceList({
  foodplaces,
  handleSelectCoordinates,
}: FoodPlaceListProps): JSX.Element {
  return (
    <div className="flex overflow-x-auto w-full">
      <div className="flex flex-nowrap gap-6 min-w-fit">
        {foodplaces?.map((foodplace, idx) => (
          <FoodPlaceCard
            key={foodplace.place_id || idx}
            foodplace={{
              place_id: foodplace.place_id || "",
              name: foodplace.name || "",
              image:
                (foodplace.photos && foodplace.photos[0]?.getUrl()) || "",
              description: foodplace.vicinity || "",
              rating: foodplace.rating || 0,
              link: foodplace.name
                ? `https://www.google.com/search?q=${encodeURIComponent(
                    foodplace.name + " tabelog"
                  )}`
                : "",
            }}
            handleCoordsChange={() => {
              const coords = foodplace.geometry?.location;
              if (coords) {
                handleSelectCoordinates({
                  lat: coords.lat(),
                  lng: coords.lng(),
                  place_id: foodplace.place_id, 
                });
                scrollToMap();
              }
            }}
            
          />
        ))}
      </div>
    </div>
  );
}

export default FoodPlaceList;