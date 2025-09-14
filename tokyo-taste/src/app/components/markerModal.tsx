import { JSX } from "react";
import { FoodPlace } from "../dataTypes/FoodPlace";
import Image from "next/image";
import Link from "next/link";

type MarkerPopupProps = Omit<
  FoodPlace,
  "id" | "coordinates" | "description" | "cusine"
>;

const MarkerModal = ({ name, image, link }: MarkerPopupProps): JSX.Element => {
  return (
    <div className="w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden transform transition-all duration-200 hover:scale-105">
      <div className="w-full h-36 relative">
        <Image
          src={image || "/placeholder.png"}
          alt={name}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
          {name}
        </h3>
        <Link
          href={link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default MarkerModal;
