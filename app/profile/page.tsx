import { getUserById, getUserSavedPlaces } from "@/lib/actions/user.action";
import { getPlacesByUserId } from "@/lib/actions/place.action";
import { auth } from "@clerk/nextjs/server";
import ProfileContent from "@/components/ProfileContent";

export default async function ProfilePage() {
  const { userId } = auth();
  const user = await getUserSavedPlaces(userId!);
  const userPlaces = await getPlacesByUserId({ userId: user._id! });

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <ProfileContent
        userPlaces={JSON.stringify(userPlaces)}
        user={JSON.stringify(user)}
      />
    </div>
  );
}
