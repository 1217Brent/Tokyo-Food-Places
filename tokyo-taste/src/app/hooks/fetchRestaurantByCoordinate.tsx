import CoordinateType from "../dataTypes/CoordinateType";

  export const fetchRestaurantByCoordinate = <U extends google.maps.places.PlaceResult[]>(
    coordinates: CoordinateType<number>,
    restaurants: U
  ): google.maps.places.PlaceResult | undefined => {
    const targetLat = Math.ceil(coordinates.lat);
    const targetLng = Math.ceil(coordinates.lng);
    let bool = false;
    try {
      const restaurant = restaurants.find((place) => {
        if (!place.geometry?.location) return false;
    
        const lat = Math.ceil(place.geometry.location.lat());
        const lng = Math.ceil(place.geometry.location.lng());
    
        bool = true;
      });
      if (bool) return restaurant;
    } catch (error) {
      return undefined;
    }
  
  };