"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { FoodPlace } from "./dataTypes/FoodPlace";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

type FoodPlaceListProps = {
  foodList: FoodPlace[];
  currCoords: FoodPlace["coordinates"];
};

function FoodPlaceMap({ foodList, currCoords }: FoodPlaceListProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Initial map setup
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: currCoords,
      zoom: 17,
    });

    map.current.on("load", () => {
      const geojsonData = {
        type: "FeatureCollection",
        features: foodList.map((foodplace: FoodPlace) => ({
          type: "Feature",
          properties: {
            name: foodplace.name,
            description: foodplace.description || "",
          },
          geometry: {
            type: "Point",
            coordinates: foodplace.coordinates,
          },
        })),
      } as GeoJSON.FeatureCollection<GeoJSON.Point>;

      map.current?.addSource("gyms", {
        type: "geojson",
        data: geojsonData,
      });

      map.current?.addLayer({
        id: "gym-circles",
        type: "circle",
        source: "gyms",
        paint: {
          "circle-color": "#4264fb",
          "circle-radius": 8,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      // Click to fly to gym
      map.current?.on("click", "gym-circles", (e) => {
        const coords = e.features?.[0]?.geometry?.coordinates;
        if (coords && map.current) {
          map.current.flyTo({ center: coords as [number, number] });
        }
      });

      // Change cursor on hover
      map.current?.on("mouseenter", "gym-circles", () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = "pointer";
        }
      });

      map.current?.on("mouseleave", "gym-circles", () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = "";
        }
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [foodList, currCoords]);



  return <div ref={mapContainer} style={{ width: "100%", height: "500px" }} />;
}

export default FoodPlaceMap;
