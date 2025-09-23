"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import debounce from "lodash/debounce";
import fetchNearbyRestaurants from "../hooks/fetchRestaurants";
import MarkerModal from "../components/markerModal";
import ReactDOMServer from "react-dom/server";
import { fetchRestaurantByCoordinate } from "../hooks/fetchRestaurantByCoordinate";

const containerStyle = { width: "100%", height: "500px" };

interface Coords {
  lat: number;
  lng: number;
}

interface InitMapProps {
  currCoords: Coords;
  handleMapUpdate: (map: google.maps.Map) => void;
  onRestaurantsUpdate: (restaurants: google.maps.places.PlaceResult[]) => void;
}

export default function InitMap({
  currCoords,
  handleMapUpdate,
  onRestaurantsUpdate,
}: InitMapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [allRestaurants, setAllRestaurants] = useState<
    google.maps.places.PlaceResult[]
  >([]);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const currCoordsRef = useRef(currCoords);
  const fetchMarkersDebounced = useRef<ReturnType<typeof debounce> | null>(null);

  // Track currently open InfoWindow
  const openInfoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Keep latest coords
  useEffect(() => {
    currCoordsRef.current = currCoords;
  }, [currCoords]);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current) return;
    if (!mapRef.current) {
      mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
        center: currCoords,
        zoom: 15,
      });
      handleMapUpdate(mapRef.current);
    }
  }, [isLoaded, handleMapUpdate, currCoords]);

  // Fetch and display markers
  useEffect(() => {
    fetchMarkersDebounced.current = debounce(async () => {
      if (!mapRef.current) return;

      try {
        const restaurants = await fetchNearbyRestaurants(
          mapRef.current,
          currCoordsRef.current
        );
        onRestaurantsUpdate(restaurants);
        setAllRestaurants(restaurants);

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

          const photoUrl: string =
            place.photos?.[0]?.getUrl({ maxWidth: 400, maxHeight: 300 }) || "";

          const infoWindow = new window.google.maps.InfoWindow({
            content: ReactDOMServer.renderToString(
              <MarkerModal
                name={place.name || "Image Unavailable"}
                image={photoUrl}
                link={place.url || ""}
              />
            ),
          });
          //so if the user clicks on it let us stay open
          //so if the user hovers it and openInfoWindow.current does not exist then we open it
          marker.addListener("click", () => {
            if (openInfoWindowRef.current) {
              // then we must close first
              openInfoWindowRef.current.close();
            } // then we open a new one
            infoWindow.open({ anchor: marker, map: mapRef.current});
            openInfoWindowRef.current = infoWindow;
          });
          // then if openInfoWindowRef does not exist then on hover we can open it
          marker.addListener("mouseover", () => {
            if (!openInfoWindowRef.current) {
              infoWindow.open({anchor: marker, map: mapRef.current});
              openInfoWindowRef.current = infoWindow;
            }
          })

          markersRef.current.push(marker);
        });
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    }, 300);

    return () => {
      fetchMarkersDebounced.current?.cancel();
    };
  }, [onRestaurantsUpdate]);

  // Pan map on coords change
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.panTo(currCoords);
    fetchMarkersDebounced.current?.();
  }, [currCoords]);

  // Trigger initial fetch once map is ready
  useEffect(() => {
    if (mapRef.current && fetchMarkersDebounced.current) {
      fetchMarkersDebounced.current();
    }
  }, [isLoaded]);

  if (loadError) return <div>Error loading Maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return <div ref={mapContainerRef} style={containerStyle} />;
}
