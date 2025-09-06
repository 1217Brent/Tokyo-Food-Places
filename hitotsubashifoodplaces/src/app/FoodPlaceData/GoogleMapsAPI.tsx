'use client';

import React, { useEffect, useRef } from 'react';import { useLoadScript, LoadScriptProps } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const libraries: LoadScriptProps['libraries'] = ['places'];

interface InitMapProps {
  currCoords: [number, number]; // [lng, lat]
}

export default function InitMap({ currCoords }: InitMapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const idleListenerRef = useRef<google.maps.MapsEventListener | null>(null);

  // Convert [lng, lat] to { lat, lng }
  const coordsObj = currCoords ? { lat: currCoords[1], lng: currCoords[0] } : { lat: 35.700383, lng: 139.772019 };

  // Initialize map only once
  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current) return;
    if (!mapRef.current) {
      mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
        center: coordsObj,
        zoom: 15,
      });
    }
  }, [isLoaded]);

  // Add idle event to always perform Places search after the map recenters
  useEffect(() => {
    if (!mapRef.current) return;
    // Remove any previous listener to avoid stacking
    if (idleListenerRef.current) {
      window.google.maps.event.removeListener(idleListenerRef.current);
      idleListenerRef.current = null;
    }
    idleListenerRef.current = mapRef.current.addListener('idle', () => {
      // Remove previous markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      const service = new window.google.maps.places.PlacesService(mapRef.current!);
      const request = {
        location: mapRef.current!.getCenter(),
        radius: 1000,
        type: 'restaurant',
      };
      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          results.forEach(place => {
            if (!place.geometry || !place.geometry.location) return;
            const marker = new window.google.maps.Marker({
              position: place.geometry.location,
              map: mapRef.current!,
              title: place.name,
            });
            markersRef.current.push(marker);
          });
        }
      });
    });
  }, [isLoaded]);

  // Whenever currCoords changes, pan the map to new center
  useEffect(() => {
    if (mapRef.current && coordsObj) {
      mapRef.current.panTo(coordsObj);
    }
  }, [coordsObj.lat, coordsObj.lng]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return <div ref={mapContainerRef} style={containerStyle} />;
}
