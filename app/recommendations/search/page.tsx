import { getPlaces } from "@/lib/actions/place.action";
import PlaceCard from "@/components/PlaceCard";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { userId } = auth();
  const user = await getUserById(userId!);

  const query = searchParams.q as string;
  const tag = searchParams.tag as string;
  const page = Number(searchParams.page) || 1;
  const pageSize = 10;

  const { places, isNext } = await getPlaces({
    searchQuery: query,
    tag,
    page,
    pageSize,
  });

  // Function to generate pagination link
  const getPaginationLink = (pageNum: number) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    params.set("page", pageNum.toString());
    return `?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold mb-4">Search Results</h1>
        {places.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {places.map((place) => (
                <PlaceCard
                  key={place._id.toString()}
                  place={JSON.stringify(place)}
                  savedPlaces={user.saved.map((savedPlace: any) =>
                    savedPlace._id.toString()
                  )}
                />
              ))}
            </div>
            <div className="flex justify-between items-center">
              {page > 1 && (
                <Link
                  href={getPaginationLink(page - 1)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Previous Page
                </Link>
              )}
              {isNext && (
                <Link
                  href={getPaginationLink(page + 1)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                >
                  Next Page
                </Link>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
