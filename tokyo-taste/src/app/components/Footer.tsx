"use client";

import React, { useEffect, useCallback, useState, useMemo, JSX } from "react";
import FoodPlaceList from "../UI/FoodPlaceList";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import InitMap from "../FoodPlaceData/GoogleMapsAPI";
import currentCoordinates from "../FoodPlaceData/CurrentCoordinates";
import DropDown from "../components/DropDown";
import Image from "next/image";
import fetchNearbyRestaurants from "../hooks/fetchRestaurants";

type Coords = typeof currentCoordinates;

const UNIVERSITY_COORDINATES: Record<string, Coords> = {
  hitotsubashi: { lat: 35.694, lng: 139.4289 },
  waseda: { lat: 35.709, lng: 139.7198 },
  keio: { lat: 35.6479, lng: 139.7464 },
};

function App(): JSX.Element {
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [foodLocations, setFoodLocations] = useState<google.maps.places.PlaceResult[]>([]);
  const [filteredFoodList, setFilteredFoodList] = useState<google.maps.places.PlaceResult[]>([]);
  const [currCoords, setCurrCoords] = useState<Coords>(currentCoordinates);
  const [selectedUniversity, setSelectedUniversity] = useState("hitotsubashi");
  const [isLoading, setIsLoading] = useState(false);

  // This function receives the Map instance from InitMap
  const handleMapUpdate = useCallback((map: google.maps.Map | null) => {
    setMapInstance(map);
  }, []);

  // When map and coordinates are ready, fetch restaurants
  useEffect(() => {
    if (!mapInstance || !currCoords) return;

    let isCancelled = false;
    setIsLoading(true);

    fetchNearbyRestaurants(mapInstance, currCoords)
      .then((restaurants) => {
        if (!isCancelled) {
          setFoodLocations(restaurants);
          setFilteredFoodList(restaurants);
        }
      })
      .catch((error) => {
        if (!isCancelled) {
          console.error("Failed to fetch restaurants:", error);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [mapInstance, currCoords]);

  const handleRestaurantsUpdate = useCallback(
    (restaurants: google.maps.places.PlaceResult[]) => {
      setFoodLocations(restaurants);
      setFilteredFoodList(restaurants);
    }, []);

  const handleDropDown = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    const newCoords = UNIVERSITY_COORDINATES[selected];
    if (newCoords) {
      setSelectedUniversity(selected);
      setCurrCoords(newCoords);
    }
  }, []);

  // Debounced search to reduce re-renders
  const handleSearchBar = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.trim().toLowerCase();
    
    if (!input) {
      setFilteredFoodList(foodLocations);
      return;
    }
    
    // Use requestAnimationFrame to defer filtering
    requestAnimationFrame(() => {
      const filtered = foodLocations.filter(place => 
        place.name?.toLowerCase().includes(input)
      );
      setFilteredFoodList(filtered);
    });
  }, [foodLocations]);

  const handleSelectFoodPlace = useCallback((coords: Coords) => {
    setCurrCoords(coords);
  }, []);

  // Memoize the restaurant count to prevent unnecessary re-renders
  const restaurantCount = useMemo(() => filteredFoodList.length, [filteredFoodList.length]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <NavBar />

      {/* Hero Section */}
      <section className="relative w-full h-[80vh] overflow-hidden">
        <Image
          src="/hitotsubashi.jpg"
          alt="Food Hero"
          className="absolute inset-0 w-full h-full object-cover"
          priority
          height={800}
          width={1200}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/70 to-slate-900/90" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-6">
          <div className="backdrop-blur-md bg-slate-900/30 rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
            <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-black tracking-tight drop-shadow-2xl bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
              Taste Tokyo
            </h1>
            <p className="mt-6 text-slate-300 text-xl md:text-2xl font-medium max-w-2xl drop-shadow-lg">
              キャンパスに近いレストラン
            </p>
            <div className="mt-6">
              <DropDown value={selectedUniversity} handleChange={handleDropDown} />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="map-section" className="w-full bg-slate-900/50">
        {/* Gradient divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              レストランマップ
            </h2>
            <p className="text-slate-400 text-lg">
              Check out the nearest places to eat!
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-cyan-300 mx-auto rounded-full mt-4"></div>
          </div>

          <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
            <div className="p-8">
              <InitMap
                currCoords={currCoords}
                handleMapUpdate={handleMapUpdate}
                onRestaurantsUpdate={handleRestaurantsUpdate}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant List Section */}
      <section id="list-section" className="w-full bg-slate-950">
        {/* Gradient divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              キャンパスに近いレストラン
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-cyan-300 mx-auto rounded-full"></div>
          </div>

          {/* Search Section */}
          <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 mb-8 border border-slate-700/50">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wide text-left">
                  Search Restaurants
                </label>
                <SearchBar onSearch={handleSearchBar} />
              </div>
            </div>
          </div>

          {/* Restaurant List */}
          <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Restaurant Collection</h3>
                <div className="text-slate-400 text-sm">
                  {restaurantCount} {restaurantCount === 1 ? 'restaurant' : 'restaurants'} found
                </div>
              </div>
              
              {isLoading ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto"></div>
                  <p className="text-slate-400 mt-4">Loading restaurants...</p>
                </div>
              ) : filteredFoodList.length > 0 ? (
                <div className="h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 rounded-2xl">
                  <FoodPlaceList
                    foodplaces={filteredFoodList}
                    handleSelectCoordinates={handleSelectFoodPlace}
                  />
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="text-slate-500 mb-2">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-lg">
                    No restaurants found.
                  </p>
                  <p className="text-slate-600 text-sm mt-2">
                    Try adjusting your search criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default App;