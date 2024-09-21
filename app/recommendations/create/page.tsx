import { getUserById } from "@/lib/actions/user.action";
import CreateRecommendPlaceForm from "@/components/CreateRecommendPlaceForm";
import { auth } from "@clerk/nextjs/server";

const Page = async () => {
  const { userId } = auth();
  const user = await getUserById(userId!);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Recommendation</h1>
      <CreateRecommendPlaceForm userId={JSON.stringify(user?._id)} />
    </div>
  );
};

export default Page;
