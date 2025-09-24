import fetchNearbyRestaurants from "../hooks/fetchRestaurants";

export async function fetchRestaurantList<T extends google.maps.Map>(map: T): Promise<google.maps.places.PlaceResult[]>{
  if (!map) return [];
  const data = await fetchNearbyRestaurants(map);
  return data;
}
