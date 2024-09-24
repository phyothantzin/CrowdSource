"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { useAuth } from "@clerk/nextjs";
import { FaEdit, FaRegBookmark, FaBookmark, FaEllipsisH } from "react-icons/fa";
import { savePlace } from "@/lib/actions/place.action";
import { usePathname, useRouter } from "next/navigation";
import { getUserById } from "@/lib/actions/user.action";
import router from "next/router";

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
    clerkId: string;
    username: string;
    picture: string;
  };
  createdAt: string;
  updatedAt: string;
};

export default function PlaceCard(props: any) {
  let user = null;
  const place = JSON.parse(props.place);
  if (props.user) {
    user = JSON.parse(props.user);
  }
  const savedPlaces = props.savedPlaces;
  const path = usePathname();
  const { userId, isSignedIn } = useAuth();

  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const closeDropdown = () => setShowDropdown(false);

  useEffect(() => {
    if (savedPlaces.includes(place._id)) {
      setIsSaved(true);
    }
  }, [savedPlaces, place._id]);

  const handleSave = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    try {
      await savePlace({
        userId: userId,
        placeId: place._id,
        path: path,
      });
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Failed to save place:", error);
    }
  };

  const handleTagClick = (tag: string) => {
    router.push(`/recommendations/search?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={toggleDropdown}
          className="text-gray-600 hover:text-gray-800"
        >
          <FaEllipsisH
            className="text-white hover:text-gray-300 transition-all duration-200"
            size={20}
          />
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
            <div className="py-1">
              {place.user.clerkId !== userId && (
                <button
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    handleSave();
                    closeDropdown();
                  }}
                >
                  {isSaved ? (
                    <FaBookmark className="mr-2" />
                  ) : (
                    <FaRegBookmark className="mr-2" />
                  )}
                  {isSaved ? "Saved" : "Save"}
                </button>
              )}
              {place.user.clerkId === userId && (
                <>
                  <Link
                    href={`/recommendations/edit/${place._id}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={closeDropdown}
                  >
                    <FaEdit className="mr-2" /> Edit
                  </Link>
                  <DeleteConfirmationDialog placeId={place._id} />
                </>
              )}
            </div>
          </div>
        )}
      </div>

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
            {place.hashtags.map((tag: string, index: number) => (
              <button
                key={index}
                onClick={() => handleTagClick(tag)}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded hover:bg-blue-200 transition-colors duration-200"
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Display user information */}
        <div className="flex items-center mt-4">
          <Image
            src={place.user.picture || user.picture}
            alt={place.user.username || user.username}
            width={32}
            height={32}
            className="rounded-full mr-2"
          />
          <span className="text-sm text-gray-600">
            {place.user.username || user.username}
          </span>
        </div>

        {/* Display creation time */}
        <p className="text-xs text-gray-400 mt-2">
          Created {formatDistanceToNow(new Date(place.createdAt))} ago
        </p>
      </div>
    </div>
  );
}
