import Link from "next/link";

import PlaceCard from "../components/PlaceCard";
import { getPlaces } from "@/lib/actions/place.action";

const Home = async () => {
  const recommendedPlaces = await getPlaces();

  return (
    <div className="min-h-screen bg-gray-100">
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold mb-4">
            Discover the Best Recommendations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedPlaces.map((place) => (
              <PlaceCard key={place._id} place={JSON.stringify(place)} />
            ))}
          </div>

          <Link
            href="/recommendations"
            className="mt-6 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Browse All Recommendations
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
