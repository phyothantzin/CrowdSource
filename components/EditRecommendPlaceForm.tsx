"use client";

import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { updatePlace } from "@/lib/actions/place.action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function EditRecommendPlaceForm(props: any) {
  const place = JSON.parse(props.place);

  const router = useRouter();
  const [name, setName] = useState(place.name);
  const [description, setDescription] = useState(place.description);
  const [during, setDuring] = useState(place.during);
  const [location, setLocation] = useState(place.location);
  const [hashtag, setHashtag] = useState("");
  const [hashtags, setHashtags] = useState<string[]>(place.hashtags);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(place.image);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddHashtag = () => {
    if (hashtag && !hashtags.includes(hashtag)) {
      setHashtags([...hashtags, hashtag]);
      setHashtag("");
    }
  };

  const handleRemoveHashtag = (tagToRemove: string) => {
    setHashtags(hashtags.filter((tag) => tag !== tagToRemove));
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await updatePlace(place._id, {
        name,
        description,
        during,
        location,
        hashtags,
        image: image ? await convertImageToBase64(image) : place.image,
      });
      toast.success("Recommendation updated successfully");
      router.push("/profile");
    } catch (error) {
      toast.error("Failed to update recommended place");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="during"
          className="block text-sm font-medium text-gray-700"
        >
          During
        </label>
        <input
          type="text"
          id="during"
          value={during}
          onChange={(e) => setDuring(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700"
        >
          Location
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="hashtag"
          className="block text-sm font-medium text-gray-700"
        >
          Hashtags
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            id="hashtag"
            value={hashtag}
            onChange={(e) => setHashtag(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <button
            type="button"
            onClick={handleAddHashtag}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {hashtags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-200 rounded-md flex items-center"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveHashtag(tag)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700"
        >
          Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full"
        />
        {imagePreview && (
          <div className="mt-2">
            <Image
              src={imagePreview}
              alt="Preview"
              width={200}
              height={200}
              className="object-cover"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Update Place
      </button>
    </form>
  );
}
