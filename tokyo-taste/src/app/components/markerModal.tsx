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
    <div className="w-56 p-3 bg-white rounded-lg shadow-lg border text-sm">
      <div className="w-full h-32 relative mb-2">
        <Image
          src={image}
          alt={name}
          className="object-cover rounded-md"
          width={256}
          height={256}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <h3 className="font-semibold text-gray-800 mb-1">{name}</h3>
      <Link
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-sm"
      >
        View Details →
      </Link>
    </div>
  );
};

export default MarkerModal;