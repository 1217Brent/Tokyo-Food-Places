import { FoodPlace } from "./FoodPlace";

type FetchedPlace = Omit<
  FoodPlace,
  "id" | "link" | "image" | "cusine" | "description"
>;

export default FetchedPlace;