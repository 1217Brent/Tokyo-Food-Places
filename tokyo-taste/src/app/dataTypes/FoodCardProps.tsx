import { MouseEventHandler } from "react";
import { FoodPlace } from "./FoodPlace";

type FoodCardProps = Omit<FoodPlace, "id" | "coordinates" | "cusine"> & {
  place_id: string;
  rating: number;
};

type FoodPlaceCardProps = {
  foodplace: FoodCardProps;
  handleCoordsChange: MouseEventHandler<HTMLDivElement>;
};

export type { FoodCardProps, FoodPlaceCardProps };
