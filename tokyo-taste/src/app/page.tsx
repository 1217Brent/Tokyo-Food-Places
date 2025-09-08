"use client";

import React, { useState, useCallback, JSX } from "react";
import FoodPlaceList from "./UI/FoodPlaceList";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import InitMap from "./FoodPlaceData/GoogleMapsAPI";
import currentCoordinates from "./FoodPlaceData/CurrentCoordinates";
import DropDown from "./components/DropDown";

type Coords = typeof currentCoordinates;

function App(): JSX.Element {
  const [foodLocations, setFoodLocations] = useState<google.maps.places.PlaceResult[]>([]);
  const [filteredFoodList, setFilteredFoodList] = useState<google.maps.places.PlaceResult[]>([]);
  const [currCoords, setCurrCoords] = useState<Coords>(currentCoordinates);
  const [selectedUniversity, setSelectedUniversity] = useState("hitotsubashi");

  const universityCoordinates: Record<string, Coords> = {
    hitotsubashi: { lat: 35.694, lng: 139.4289 },
    waseda: { lat: 35.709, lng: 139.7198 },
    keio: { lat: 35.6479, lng: 139.7464 },
  };

  const handleRestaurantsUpdate = useCallback((restaurants: google.maps.places.PlaceResult[]) => {
    setFoodLocations(restaurants);
    setFilteredFoodList(restaurants);
  }, []);

  const handleDropDown = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    const newCoords = universityCoordinates[selected];
    if (newCoords) {
      setSelectedUniversity(selected);
      setCurrCoords(newCoords);
    }
  }, [universityCoordinates]);

  const handleSearchBar = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.trim().toLowerCase();
    if (!input) {
      setFilteredFoodList(foodLocations);
      return;
    }
    setFilteredFoodList(
      foodLocations.filter((place) => place.name?.toLowerCase().includes(input))
    );
  }, [foodLocations]);

  const handleSelectFoodPlace = useCallback((coords: Coords) => {
    setCurrCoords(coords);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <NavBar />

      <section className="relative w-full h-[80vh] overflow-hidden">
        <img
          src="/hitotsubashi.jpg"
          alt="Food Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-6">
          <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-8 border border-white/20">
            <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-black tracking-tight drop-shadow-2xl">
              Taste Tokyo
            </h1>
            <p className="mt-6 text-white/90 text-xl md:text-2xl font-medium max-w-2xl drop-shadow-lg">
              キャンパスに近いレストラン
            </p>
            <div className="mt-4">
              <DropDown value={selectedUniversity} handleChange={handleDropDown} />
            </div>
          </div>
        </div>
      </section>

      <section id="map-section" className="w-full bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              レストランマップ
            </h2>
            <p className="text-gray-600 text-lg">Check out the nearest places to eat!</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="p-8">
              <InitMap
                currCoords={currCoords}
                handleMapUpdate={() => {}}
                onRestaurantsUpdate={handleRestaurantsUpdate}
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="list-section"
        className="w-full bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              キャンパスに近いレストラン
            </h2>
            <div className="w-24 h-1 bg-white/80 mx-auto rounded-full"></div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide text-left">
                  Search Restaurants
                </label>
                <SearchBar onSearch={handleSearchBar} />
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Restaurant Collection</h3>
              </div>
              {filteredFoodList.length > 0 && (
                <div className="h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 rounded-2xl">
                  <FoodPlaceList
                    foodplaces={filteredFoodList}
                    handleSelectCoordinates={handleSelectFoodPlace}
                  />
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
