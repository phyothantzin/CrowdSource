"use client";

import { useState } from "react";
import PlaceCard from "./PlaceCard";

export default function ProfileContent({
  userPlaces,
  userSavedPlaces,
}: {
  userPlaces: any;
  userSavedPlaces: any;
}) {
  const places = JSON.parse(userPlaces);
  const savedPlaces = JSON.parse(userSavedPlaces);
  const [activeTab, setActiveTab] = useState("recommendations");

  return (
    <div className="mb-8">
      <div className="flex border-b">
        <button
          className={`py-2 px-4 text-center font-semibold ${
            activeTab === "recommendations"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("recommendations")}
        >
          Your Recommendations
        </button>
        <button
          className={`py-2 px-4 text-center font-semibold ${
            activeTab === "saved"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("saved")}
        >
          Saved Places
        </button>
      </div>

      <div className="mt-4">
        {activeTab === "recommendations" && (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              Your Recommendations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {places.map((place: any) => (
                <PlaceCard
                  key={place._id.toString()}
                  place={JSON.stringify(place)}
                  savedPlaces={savedPlaces.map((savedPlace: any) =>
                    savedPlace._id.toString()
                  )}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === "saved" && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Saved Places</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedPlaces.length > 0 ? (
                savedPlaces.map((place: any) => (
                  <PlaceCard
                    key={place._id.toString()}
                    place={JSON.stringify(place)}
                    savedPlaces={savedPlaces.map((savedPlace: any) =>
                      savedPlace._id.toString()
                    )}
                  />
                ))
              ) : (
                <p className="text-start text-gray-500">No saved places</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
