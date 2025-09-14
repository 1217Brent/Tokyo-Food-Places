"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import debounce from "lodash/debounce";
import fetchNearbyRestaurants from "../hooks/fetchRestaurants";
import MarkerModal from "../components/markerModal";
import ReactDOMServer from "react-dom/server";

const containerStyle = { width: "100%", height: "500px" };

interface Coords {
  lat: number;
  lng: number;
}

interface InitMapProps {
  currCoords: Coords;
  handleMapUpdate: (map: google.maps.Map | null) => void;
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
  const fetchMarkersDebounced = useRef<ReturnType<typeof debounce> | null>(
    null
  );

  const fetchRestaurantByCoordinate = (
    coordinates: Coords,
    restaurants: google.maps.places.PlaceResult[]
  ): google.maps.places.PlaceResult | null => {
    const targetLat = Math.ceil(coordinates.lat);
    const targetLng = Math.ceil(coordinates.lng);
  
    const restaurant = restaurants.find((place) => {
      if (!place.geometry?.location) return false;
  
      const lat = Math.ceil(place.geometry.location.lat());
      const lng = Math.ceil(place.geometry.location.lng());
  
      return lat === targetLat && lng === targetLng;
    });
  
    if (restaurant) return restaurant;
  
    console.warn("Failed to fetch restaurant by coordinates");
    return null; 
  };
  

  // Keep latest currCoords in ref for debounced function
  useEffect(() => {
    currCoordsRef.current = currCoords;
  }, [currCoords]);

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
  }, [isLoaded, handleMapUpdate, currCoords]);

  // Create debounced fetchMarkers once on mount
  useEffect(() => {
    fetchMarkersDebounced.current = debounce(async () => {
      if (!mapRef.current) return;

      fetchNearbyRestaurants(mapRef.current, currCoordsRef.current)
        .then((restaurants) => {
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
              place.photos?.[0]?.getUrl({ maxWidth: 400, maxHeight: 300 }) ||
              "";

            const infoWindow = new google.maps.InfoWindow({
              content: ReactDOMServer.renderToString(
                <MarkerModal
                  name={place.name || "Image Unavailable"}
                  image={photoUrl}
                  link={place.url || ""}
                />
              ),
            });
            marker.addListener("click", () => {
              infoWindow.open({
                anchor: marker,
                map: mapRef.current,
                shouldFocus: false, // Optional: prevent focus on InfoWindow
              });
            });
            marker.addListener("mouseon", () => {
              infoWindow.open({
                anchor: marker,
                map: mapRef.current,
                shouldFocus: false, // Optional: prevent focus on InfoWindow
              });
            });
            marker.addListener("mouseout", function () {
              infoWindow.close();
            });
            markersRef.current.push(marker);
          });
        })
        .catch((error) => {
          console.error("Error fetching restaurants:", error);
        });
    }, 300);
    return () => {
      if (fetchMarkersDebounced.current) {
        fetchMarkersDebounced.current.cancel();
      }
    };
  }, [onRestaurantsUpdate]);

  // Pan map and fetch markers on coords change
  useEffect(() => {
    if (
      !mapRef.current ||
      !fetchMarkersDebounced.current ||
      typeof currCoords.lat !== "number" ||
      typeof currCoords.lng !== "number" ||
      !isFinite(currCoords.lat) ||
      !isFinite(currCoords.lng)
    )
      return;

    mapRef.current.panTo(currCoords);
    fetchMarkersDebounced.current();
    const place = fetchRestaurantByCoordinate(currCoords, allRestaurants);
    const photoUrl: string =
    place?.photos?.[0]?.getUrl({ maxWidth: 400, maxHeight: 300 }) ||
    "";
    const marker = new window.google.maps.Marker({
      position: place?.geometry?.location,
      map: mapRef.current!,
      title: place?.name || "",
    });
    const infoWindow = new google.maps.InfoWindow({
      content: ReactDOMServer.renderToString(
        <MarkerModal
          name={place?.name || "Image Unavailable"}
          image={photoUrl}
          link={place?.url || ""}
        />
      ),
    });
    infoWindow.open({
      anchor: marker,
      map: mapRef.current,
      shouldFocus: false, // Optional: prevent focus on InfoWindow
    });
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
