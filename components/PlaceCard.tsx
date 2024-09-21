"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { auth } from "@clerk/nextjs/server";
import { FaEdit, FaTrash } from "react-icons/fa";
import { usePathname } from "next/navigation";

// Update the Place type to match the new data structure
type Place = {
  _id: string;
  name: string;
  description: string;
  during: string;
  location: string;
  hashtags: string[];
  image: string; // base64 image
  user: {
    _id: string;
    username: string;
    picture: string;
  };
  createdAt: string;
  updatedAt: string;
};

export default function PlaceCard({ place }: { place: Place }) {
  const { userId } = auth();
  const pathname = usePathname();
  const isProfileRoute = pathname.includes("/profile");

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden relative group">
      {isProfileRoute && place.user._id === userId && (
        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link href={`/recommendations/edit?id=${place._id.toString()}`}>
            <FaEdit
              className="text-blue-500 hover:text-blue-600 cursor-pointer"
              size={20}
            />
          </Link>
          <DeleteConfirmationDialog placeId={place._id.toString()} />
        </div>
      )}

      {/* Display the base64 image */}
      {place.image && (
        <div className="relative h-48">
          <Image
            src={place.image}
            alt={place.name}
            layout="fill"
            objectFit="cover"
          />
        </div>
      )}

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{place.name}</h2>
        <p className="text-gray-600 mb-2">{place.description}</p>

        {/* Display location and best times to visit */}
        <p className="text-sm text-gray-500 mb-1">
          <span className="font-medium">Location:</span> {place.location}
        </p>
        <p className="text-sm text-gray-500 mb-2">
          <span className="font-medium">Best times to visit:</span>{" "}
          {place.during}
        </p>

        {/* Display hashtags */}
        {place.hashtags && place.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {place.hashtags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Display user information */}
        <div className="flex items-center mt-4">
          <Image
            src={place.user.picture}
            alt={place.user.username}
            width={32}
            height={32}
            className="rounded-full mr-2"
          />
          <span className="text-sm text-gray-600">{place.user.username}</span>
        </div>

        {/* Display creation time */}
        {place.user._id === userId && (
          <div className="flex justify-between items-center">
            <Link
              href={`/recommendations/edit?id=${place._id.toString()}`}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit
            </Link>
            <DeleteConfirmationDialog placeId={place._id.toString()} />
          </div>
        )}
        <p className="text-xs text-gray-400 mt-2">
          Created {formatDistanceToNow(new Date(place.createdAt))} ago
        </p>
      </div>
    </div>
  );
}
