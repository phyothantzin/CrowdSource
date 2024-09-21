import { getUserById } from "@/lib/actions/user.action";
import { deletePlace, getPlacesByUserId } from "@/lib/actions/place.action";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import PlaceCard from "@/components/PlaceCard";

export default async function ProfilePage() {
  const { userId } = auth();
  const user = await getUserById(userId!);
  const places = await getPlacesByUserId({ userId: user._id });

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Recommendations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {places.map((place: any) => (
            <PlaceCard key={place._id.toString()} place={place} />
          ))}
        </div>
      </div>
    </div>
  );
}
