"use client";

import { JSX, MouseEventHandler } from "react";
import FoodPlaceCard from "./FoodPlaceCard";

interface FoodPlaceListProps {
  foodplaces: google.maps.places.PlaceResult[];
  handleSelectCoordinates: (coordinates: google.maps.LatLngLiteral) => void;
}

function scrollToMap(): MouseEventHandler<HTMLDivElement> | undefined {
  const map = document.getElementById("map-section");
  if (map) {
    map.scrollIntoView({ behavior: "smooth" });
  }
  return undefined;
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
            key={idx}
            foodplace={{
              place_id: foodplace.place_id || "",
              name: foodplace.name || "",
              image: (foodplace.photos && foodplace.photos[0]?.getUrl()) || "",
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
                });
                scrollToMap();
                console.log("should be scrolled");
                console.log(scrollToMap);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default FoodPlaceList;
