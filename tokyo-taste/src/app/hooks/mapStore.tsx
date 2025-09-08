let mapInstance: google.maps.Map | null = null;

export function setMapInstance(map: google.maps.Map) {
  mapInstance = map;
}

export function getMapInstance(): google.maps.Map | null {
  return mapInstance;
}
