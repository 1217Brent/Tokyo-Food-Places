"use client";

import { useState } from "react";
import { JSX } from "react";
import { FoodPlace } from "./dataTypes/FoodPlace";
import FoodLocations from "./FoodPlaceData/foodPlaceData";
import FoodPlaceList from "./UI/FoodPlaceList";
import FoodPlaceMap from "./components/FoodMap/FoodMap";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import DropDown from "./components/DropDown";

type Coords = FoodPlace["coordinates"];

function App(): JSX.Element {
  const foodPlaceLocations = FoodLocations;
  const [currCoords, setCurrCoords] = useState<Coords>([139.4413, 35.6999]);
  const [filteredFoodList, setFilteredFoodList] =
    useState<FoodPlace[]>(foodPlaceLocations);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);

  function handleSelectFoodPlace(coordinates: Coords): void {
    setCurrCoords(coordinates);
    console.log("選択された座標:", coordinates);
  }

  const scrollToSection = (id: string): void => {
    const element = document.getElementById(id);
    element?.scrollIntoView({behavior: "smooth"});
  }

  const handleSearchBar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    if (input === "") {
      setFilteredFoodList(foodPlaceLocations);
      return;
    }

    const newList: FoodPlace[] = [];
    foodPlaceLocations.forEach((foodplace: FoodPlace) => {
      if (foodplace.name.includes(input)) {
        newList.push(foodplace);
      }
    });
    setFilteredFoodList(newList);
  };

  const handleDropDown = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedCuisines(selectedOptions);

    if (selectedOptions.length === 0 || selectedOptions.includes("ALL")) {
      setFilteredFoodList(foodPlaceLocations);
      return;
    }

    const newList = foodPlaceLocations.filter((foodPlace) =>
      foodPlace.cusine.some((cuisine: string) =>
        selectedOptions.includes(cuisine.toLowerCase())
      )
    );
    setFilteredFoodList(newList);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <NavBar />

      {/* Hero Section */}
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
              一橋の近くのレストランで美味しい飯を食べよう！
            </p>
            <button
              onClick={() => scrollToSection("search-section")}
              className="mt-8 inline-flex items-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-8 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out"
            >
              <span className="mr-2">🍜</span>
              Explore Eats
            </button>
          </div>
        </div>
      </section>



      {/* Map Section */}
      <section id="map-section" className="w-full bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Interactive Map
            </h2>
            <p className="text-gray-600 text-lg">
              Click on any location to see it highlighted
            </p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="p-8">
              <FoodPlaceMap foodList={filteredFoodList} currCoords={currCoords} />
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant List Section */}
      <section id="list-section" className="w-full bg-gradient-to-br from-red-800 via-red-700 to-red-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              一橋に近いレストラン
            </h2>
            <div className="w-24 h-1 bg-white/80 mx-auto rounded-full"></div>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide text-left">
                  Search Restaurants
                </label>
                <SearchBar onSearch={handleSearchBar} />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide text-left">
                  Filter by Cuisine
                </label>
                <DropDown
                  handleChange={handleDropDown}
                  multiple={true}
                  value={selectedCuisines}
                />
              </div>
            </div>
          </div>

          {/* Restaurant List */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Restaurant Collection
                </h3>
                <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                  {filteredFoodList.length} places found
                </div>
              </div>
              
              <div className="h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 rounded-2xl">
                <FoodPlaceList
                  foodplaces={filteredFoodList}
                  handleSelectCoordinates={handleSelectFoodPlace}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default App;