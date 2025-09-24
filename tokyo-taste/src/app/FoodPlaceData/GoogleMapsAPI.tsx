"use client";

import React, { useEffect, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";
import debounce from "lodash/debounce";
import fetchNearbyRestaurants from "../hooks/fetchRestaurants";
import MarkerModal from "../components/markerModal";
import ReactDOMServer from "react-dom/server";

const containerStyle = {
  width: "100%",
  height: "500px"
};

interface Coords {
  lat: number;
  lng: number;
  place_id?: string;
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
  const markersRef = useRef<Map<string, { marker: google.maps.Marker; place: google.maps.places.PlaceResult }>>(new Map());
  const fetchMarkersDebounced = useRef<ReturnType<typeof debounce> | null>(null);
  const openInfoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Function to create and show info window
  const showInfoWindow = (marker: google.maps.Marker, place: google.maps.places.PlaceResult) => {
    const photoUrl = place.photos?.[0]?.getUrl({ maxWidth: 400, maxHeight: 300 }) || "";
    const infoWindow = new window.google.maps.InfoWindow({
      content: ReactDOMServer.renderToString(
        <MarkerModal
          name={place.name || "Image Unavailable"}
          image={photoUrl}
          rating={place.rating}
          address={place.formatted_address || ""}
        />
      ),
    });

    // Close any open info window first
    if (openInfoWindowRef.current) {
      openInfoWindowRef.current.close();
    }

    // Open the new info window
    infoWindow.open({ anchor: marker, map: mapRef.current });
    openInfoWindowRef.current = infoWindow;
  };

  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
        center: currCoords,
        zoom: 15,
      });
      handleMapUpdate(mapRef.current);
    }
  }, [isLoaded, handleMapUpdate]);

  useEffect(() => {
    fetchMarkersDebounced.current = debounce(async () => {
      if (!mapRef.current) return;

      try {
        console.log("Fetching restaurants for coordinates:", currCoords);
        const restaurants = await fetchNearbyRestaurants(mapRef.current, currCoords);
        onRestaurantsUpdate(restaurants);

        // Clear existing markers
        markersRef.current.forEach(({ marker }) => marker.setMap(null));
        markersRef.current.clear();

        // Create new markers
        restaurants.forEach((place, index) => {
          if (!place.geometry?.location) return;

          const marker = new window.google.maps.Marker({
            position: place.geometry.location,
            map: mapRef.current!,
            title: place.name || "",
          });

          marker.addListener("click", () => {
            showInfoWindow(marker, place);
          });

          marker.addListener("mouseover", () => {
            if (!openInfoWindowRef.current) {
              showInfoWindow(marker, place);
            }
          });

          // Use multiple keys to store the marker for easier lookup
          const placeId = place.place_id || "";
          const placeName = place.name || "";
          const indexKey = `index_${index}`;

          console.log(`Storing marker ${index}:`, {
            place_id: placeId,
            name: placeName,
            keys: [placeId, placeName, indexKey]
          });

          const markerData = { marker, place };
          
          // Store with multiple keys for easier lookup
          if (placeId) markersRef.current.set(placeId, markerData);
          if (placeName) markersRef.current.set(placeName, markerData);
          markersRef.current.set(indexKey, markerData);
        });

        console.log("All marker keys:", Array.from(markersRef.current.keys()));
      } catch (error) {
        console.error(error);
      }
    }, 300);

    return () => {
      fetchMarkersDebounced.current?.cancel();
    };
  }, [currCoords, onRestaurantsUpdate]);

  // Handle coordinate changes and marker selection
  useEffect(() => {
    if (!mapRef.current) return;

    console.log("=== Coordinate change detected ===");
    console.log("New coordinates:", currCoords);

    // Pan to new coordinates
    mapRef.current.panTo({ lat: currCoords.lat, lng: currCoords.lng });

    // If this is a restaurant selection (has place_id), select the specific marker
    if (currCoords.place_id) {
      console.log("Looking for marker with place_id:", currCoords.place_id);
      console.log("Available markers:", Array.from(markersRef.current.keys()));
      
      // Try to find the marker data
      let markerData = markersRef.current.get(currCoords.place_id);
      
      if (markerData) {
        console.log("Found marker by place_id!");
        showInfoWindow(markerData.marker, markerData.place);
        mapRef.current.setZoom(17);
      } else {
        console.log("Marker not found by place_id, this might be a timing issue");
        // If we can't find it immediately, try after a short delay
        setTimeout(() => {
          const delayedMarkerData = markersRef.current.get(currCoords.place_id!);
          if (delayedMarkerData) {
            console.log("Found marker on delayed retry!");
            showInfoWindow(delayedMarkerData.marker, delayedMarkerData.place);
            mapRef.current!.setZoom(17);
          } else {
            console.log("Still couldn't find marker after delay");
            console.log("Available keys at retry:", Array.from(markersRef.current.keys()));
          }
        }, 500);
      }
    } else {
      // This is a university selection, fetch new restaurants
      console.log("University selection - fetching new restaurants");
      fetchMarkersDebounced.current?.();
    }
  }, [currCoords]);

  useEffect(() => {
    if (mapRef.current && fetchMarkersDebounced.current) {
      fetchMarkersDebounced.current();
    }
  }, [isLoaded]);

  if (loadError) return <div>Error loading Maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return <div ref={mapContainerRef} style={containerStyle} />;
}