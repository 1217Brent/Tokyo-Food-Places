import fetchNearbyRestaurants from "../hooks/fetchRestaurants";

export async function fetchRestaurantList(map: google.maps.Map) {
  if (!map) return [];
  const data = await fetchNearbyRestaurants(map);
  return data;
}
