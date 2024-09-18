import React from "react";

interface Place {
  id: number;
  photo: string;
  title: string;
  description: string;
  hashtags: string[];
}

interface PlaceCardProps {
  place: Place;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img
        src={place.photo}
        alt={place.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{place.title}</h3>
        <p className="text-gray-600 mb-2">{place.description}</p>
        <div className="flex flex-wrap">
          {place.hashtags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-2"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
