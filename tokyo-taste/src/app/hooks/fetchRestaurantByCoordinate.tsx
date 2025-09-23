import { CoordinateType } from "../dataTypes/CoordinateType";
  export const fetchRestaurantByCoordinate = <U extends google.maps.places.PlaceResult[]>(
    coordinates: CoordinateType<number>,
    restaurants: U
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