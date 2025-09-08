import currentCoordinates from "../FoodPlaceData/CurrentCoordinates";

export default function fetchNearbyRestaurants(
    map: google.maps.Map,
    location: google.maps.LatLngLiteral = currentCoordinates as google.maps.LatLngLiteral,
    radius: number = 1000,
    type: string = "restaurant"
  ): Promise<google.maps.places.PlaceResult[]> {
    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.maps.places) {
        reject(new Error("Google Maps JavaScript API not loaded"));
        return;
      }
  
      const service = new window.google.maps.places.PlacesService(map);
  
      const request: google.maps.places.PlaceSearchRequest = {
        location,
        radius,
        type,
      };
  
      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results);
        } else {
          reject(new Error(`PlacesService failed with status: ${status}`));
        }
      });
    });
  }
  