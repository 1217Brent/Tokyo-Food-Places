"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

import type { FoodPlace } from "@/app/dataTypes/FoodPlace";

interface FoodPlaceListProps {
  foodList: FoodPlace[];
  currCoords: [number, number]; // Mapbox expects [lng, lat]
}

function FoodPlaceMap({ foodList, currCoords }: FoodPlaceListProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: currCoords,
      zoom: 17,
    });

    map.current.on("load", () => {
      const geojsonData: GeoJSON.FeatureCollection<GeoJSON.Point> = {
        type: "FeatureCollection",
        features: foodList.map((foodplace) => ({
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
      };

      if (map.current && map.current.getSource("foodplaces")) {
        (map.current.getSource("foodplaces") as mapboxgl.GeoJSONSource).setData(geojsonData);
      } else if (map.current) {
        map.current.addSource("foodplaces", {
          type: "geojson",
          data: geojsonData,
        });

        map.current.addLayer({
          id: "foodplace-circles",
          type: "circle",
          source: "foodplaces",
          paint: {
            "circle-color": "#4264fb",
            "circle-radius": 8,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          },
        });

        // Click to fly to a food place
        map.current.on("click", "foodplace-circles", (e) => {
          const coords = e.features?.[0]?.geometry?.coordinates;
          if (coords && map.current) {
            map.current.flyTo({ center: coords as [number, number] });
          }
        });

        // Cursor pointer on hover
        map.current.on("mouseenter", "foodplace-circles", () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = "pointer";
          }
        });

        map.current.on("mouseleave", "foodplace-circles", () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = "";
          }
        });
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [foodList, currCoords]);

  useEffect(() => {
    if (map.current) {
      map.current.flyTo({ center: currCoords });
    }
  }, [currCoords]);

  return <div ref={mapContainer} style={{ width: "100%", height: "500px" }} />;
}

export default FoodPlaceMap;
