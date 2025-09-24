interface Coordinates {
  lat: number;
  lng: number;
}

export interface FoodPlace {
  id: number;
  name: string;
  image: string;
  coordinates: Coordinates;
  description: string;
  link: string;
  cusine: string[];
}
