"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useLoadScript, LoadScriptProps } from "@react-google-maps/api";
import debounce from "lodash/debounce";
import fetchNearbyRestaurants from "../hooks/fetchRestaurants";

const containerStyle = { width: "100%", height: "500px" };

interface InitMapProps {
  currCoords: { lat: number; lng: number };
  handleMapUpdate: (map: google.maps.Map | null) => void;
  onRestaurantsUpdate: (restaurants: google.maps.places.PlaceResult[]) => void;
}

export default function InitMap({ currCoords, handleMapUpdate, onRestaurantsUpdate }: InitMapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Initialize map once
  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current) return;
    if (!mapRef.current) {
      mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
        center: currCoords,
        zoom: 15,
      });
      handleMapUpdate(mapRef.current);
    }
  }, [isLoaded]);

  // Debounced fetch & marker update to reduce flicker on rapid updates
  const fetchAndUpdateMarkers = useCallback(
    debounce(() => {
      if (!mapRef.current) return;

      fetchNearbyRestaurants(mapRef.current, currCoords)
        .then((restaurants) => {
          onRestaurantsUpdate(restaurants);

          // Clear old markers
          markersRef.current.forEach((marker) => marker.setMap(null));
          markersRef.current = [];

          // Add new markers
          restaurants.forEach((place) => {
            if (!place.geometry?.location) return;
            const marker = new window.google.maps.Marker({
              position: place.geometry.location,
              map: mapRef.current!,
              title: place.name || "",
            });
            markersRef.current.push(marker);
          });
        })
        .catch((error) => {
          console.error("Error fetching restaurants:", error);
        });
    }, 300),
    [currCoords, onRestaurantsUpdate]
  );

  useEffect(() => {
    if (
      mapRef.current &&
      typeof currCoords.lat === "number" &&
      typeof currCoords.lng === "number" &&
      isFinite(currCoords.lat) &&
      isFinite(currCoords.lng)
    ) {
      mapRef.current.panTo(currCoords);
      fetchAndUpdateMarkers();
    }
  }, [currCoords, fetchAndUpdateMarkers]);

  if (loadError) return <div>Error loading Maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return <div ref={mapContainerRef} style={containerStyle} />;
}
