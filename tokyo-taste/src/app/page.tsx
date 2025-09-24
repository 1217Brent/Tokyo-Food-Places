"use client";

import React, { useCallback, useState, useMemo, JSX } from "react";
import FoodPlaceList from "./UI/FoodPlaceList";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import InitMap from "./FoodPlaceData/GoogleMapsAPI";
import currentCoordinates from "./FoodPlaceData/CurrentCoordinates";
import DropDown from "./components/DropDown";
import Image from "next/image";

interface Coords {
  lat: number;
  lng: number;
  place_id?: string;
}

function App(): JSX.Element {
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [foodLocations, setFoodLocations] = useState<
    google.maps.places.PlaceResult[]
  >([]);
  const [filteredFoodList, setFilteredFoodList] = useState<
    google.maps.places.PlaceResult[]
  >([]);
  const [currCoords, setCurrCoords] = useState<Coords & { place_id?: string }>(currentCoordinates);
  const [selectedUniversity, setSelectedUniversity] = useState("hitotsubashi");

  const universityCoordinates: Record<string, Coords> = useMemo(
    () => ({
      hitotsubashi: { lat: 35.694, lng: 139.4289 },
      waseda: { lat: 35.709, lng: 139.7198 },
      keio: { lat: 35.6479, lng: 139.7464 },
    }),
    []
  );

  const handleMapUpdate = useCallback((map: google.maps.Map | null) => {
    setMapInstance(map);
  }, []);

  const handleRestaurantsUpdate = useCallback(
    (restaurants: google.maps.places.PlaceResult[]) => {
      console.log("App: Received restaurant update with", restaurants.length, "restaurants", mapInstance);
      setFoodLocations(restaurants);
      setFilteredFoodList(restaurants);
    },
    []
  );

  const scrollToMap = () => {
    const map = document.getElementById("map-section");
    if (map) {
      map.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDropDown = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selected = e.target.value;
      const newCoords = universityCoordinates[selected];
      if (newCoords) {
        console.log("App: University changed to", selected, newCoords);
        setSelectedUniversity(selected);
        setCurrCoords(newCoords); // This will trigger restaurant fetch in InitMap
        scrollToMap();
      }
    },
    [universityCoordinates]
  );

  const handleSearchBar = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value.trim().toLowerCase();
      if (!input) {
        setFilteredFoodList(foodLocations);
        return;
      }

      setFilteredFoodList(
        foodLocations.filter((place) =>
          place.name?.toLowerCase().includes(input)
        )
      );
    },
    [foodLocations]
  );

  const handleSelectFoodPlace = useCallback((coords: Coords): void => {
    console.log("App: Selected restaurant coords:", coords);
    setCurrCoords(coords);
    scrollToMap();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-300">
      <NavBar />
      <section className="relative w-full h-[80vh] overflow-hidden">
        <Image
          src="/hitotsubashi.jpg"
          alt="Food Hero"
          className="absolute inset-0 w-full h-full object-cover brightness-75"
          priority
          height={256}
          width={256}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/70 to-slate-900/95" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-6">
          <div className="backdrop-blur-md bg-slate-900/40 rounded-2xl p-8 border border-slate-700/60">
            <h1 className="text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-6xl font-extrabold tracking-tight drop-shadow-lg">
              Taste Tokyo
            </h1>
            <p className="mt-6 text-slate-300 text-2xl font-medium max-w-2xl drop-shadow-md">
              キャンパスに近いレストラン
            </p>
            <div className="mt-5">
              <DropDown value={selectedUniversity} handleChange={handleDropDown} />
            </div>
          </div>
        </div>
      </section>

      <section id="map-section" className="w-full bg-slate-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold text-cyan-300 mb-3">
              レストランマップ
            </h2>
            <p className="text-slate-400 text-lg">
              Check out the nearest places to eat!
            </p>
          </div>
          <div className="bg-slate-900 rounded-3xl shadow-lg overflow-hidden border border-slate-700">
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

      <section
        id="list-section"
        className="w-full bg-gradient-to-br from-blue-900 via-slate-900 to-[#0f172a]"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-6">
              キャンパスに近いレストラン
            </h2>
            <div className="w-24 h-1 bg-cyan-400 mx-auto rounded-full"></div>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-md rounded-3xl shadow-lg p-8 mb-8 border border-cyan-500/40">
            <div className="space-y-4 max-w-md mx-auto">
              <label className="block text-cyan-300 text-sm font-semibold uppercase tracking-wide text-left">
                Search Restaurants
              </label>
              <SearchBar onSearch={handleSearchBar} />
            </div>
          </div>

          <div className="bg-slate-900/90 h-[700px] backdrop-blur-md rounded-3xl shadow-lg overflow-hidden border border-cyan-600/60">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-cyan-400">
                  Restaurant Collection
                </h3>
                <span className="text-slate-400 text-sm">
                  {filteredFoodList.length} restaurants
                </span>
              </div>
              {filteredFoodList.length > 0 ? (
                <FoodPlaceList
                  foodplaces={filteredFoodList}
                  handleSelectCoordinates={handleSelectFoodPlace}
                />
              ) : (
                <p className="text-center text-slate-500 py-20">
                  No restaurants found.
                </p>
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