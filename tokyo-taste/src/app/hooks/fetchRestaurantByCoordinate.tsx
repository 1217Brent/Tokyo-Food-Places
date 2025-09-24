interface Coords {
  lat: number;
  lng: number;
}

export const fetchRestaurantByCoordinate = (
  coordinates: Coords,
  restaurants: google.maps.places.PlaceResult[]
): google.maps.places.PlaceResult | undefined => {
  return restaurants.find((r) => {
    if (!r.geometry?.location) return false;
    const loc = r.geometry.location;
    return (
      Math.abs(loc.lat() - coordinates.lat) < 0.000001 &&
      Math.abs(loc.lng() - coordinates.lng) < 0.000001
    );
  });
};
