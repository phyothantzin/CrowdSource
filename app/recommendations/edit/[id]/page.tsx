import { getPlaceById } from "@/lib/actions/place.action";
import EditRecommendPlaceForm from "@/components/EditRecommendPlaceForm";

export default async function EditRecommendationPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const place = await getPlaceById({ id });

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Recommendation</h1>
      {place ? (
        <EditRecommendPlaceForm place={JSON.stringify(place)} />
      ) : (
        <p>Place not found</p>
      )}
    </div>
  );
}
