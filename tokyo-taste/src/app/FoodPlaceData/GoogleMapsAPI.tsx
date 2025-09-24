"use client";

import React, { useEffect, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";
import debounce from "lodash/debounce";
import fetchNearbyRestaurants from "../hooks/fetchRestaurants";
import MarkerModal from "../components/markerModal";
import ReactDOMServer from "react-dom/server";

const containerStyle = {
  width: "100%",
  height: "500px",
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
  const markersRef = useRef<
    Map<
      string,
      { marker: google.maps.Marker; place: google.maps.places.PlaceResult }
    >
  >(new Map());
  const fetchMarkersDebounced = useRef<ReturnType<typeof debounce> | null>(
    null
  );
  const openInfoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const showInfoWindow = (
    marker: google.maps.Marker,
    place: google.maps.places.PlaceResult
  ) => {
    const photoUrl =
      place.photos?.[0]?.getUrl({ maxWidth: 400, maxHeight: 300 }) || "";
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

    if (openInfoWindowRef.current) {
      openInfoWindowRef.current.close();
    }
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
  }, [currCoords, isLoaded, handleMapUpdate]);

  useEffect(() => {
    fetchMarkersDebounced.current = debounce(async () => {
      if (!mapRef.current) return;

      try {
        console.log("Fetching restaurants for coordinates:", currCoords);
        const restaurants = await fetchNearbyRestaurants(
          mapRef.current,
          currCoords
        );
        onRestaurantsUpdate(restaurants);

        markersRef.current.forEach(({ marker }) => marker.setMap(null));
        markersRef.current.clear();
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

          const placeId = place.place_id || "";
          const placeName = place.name || "";
          const indexKey = `index_${index}`;

          console.log(`Storing marker ${index}:`, {
            place_id: placeId,
            name: placeName,
            keys: [placeId, placeName, indexKey],
          });

          const markerData = { marker, place };

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
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.panTo({ lat: currCoords.lat, lng: currCoords.lng });
    if (currCoords.place_id) {
      const markerData = markersRef.current.get(currCoords.place_id);

      if (markerData) {
        showInfoWindow(markerData.marker, markerData.place);
        mapRef.current.setZoom(17);
      } else {
        setTimeout(() => {
          const delayedMarkerData = markersRef.current.get(
            currCoords.place_id!
          );
          if (delayedMarkerData) {
            showInfoWindow(delayedMarkerData.marker, delayedMarkerData.place);
            mapRef.current!.setZoom(17);
          } else {
            console.log("Still couldn't find marker after delay");
            console.log(
              "Available keys at retry:",
              Array.from(markersRef.current.keys())
            );
          }
        }, 500);
      }
    } else {
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
