import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

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
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
        <p className="text-xs text-gray-400 mt-2">
          Created {formatDistanceToNow(new Date(place.createdAt))} ago
        </p>
      </div>
    </div>
  );
}
