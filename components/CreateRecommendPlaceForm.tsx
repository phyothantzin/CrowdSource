"use client";

import { useState } from "react";
import Image from "next/image";
import { createPlace } from "@/lib/actions/place.action";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function CreateRecommendPlaceForm({
  userId,
}: {
  userId: string;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [during, setDuring] = useState("");
  const [location, setLocation] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const router = useRouter();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleHashtagSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && hashtag.trim() !== "") {
      e.preventDefault();
      setHashtags([...hashtags, `#${hashtag.trim()}`]);
      setHashtag("");
    }
  };

  const removeHashtag = (tagToRemove: string) => {
    setHashtags(hashtags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await createPlace({
        name,
        description,
        during,
        location,
        hashtags,
        image: image ? await convertImageToBase64(image) : null,
        user: JSON.parse(userId),
      });
      toast.success("Recommendation created successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to create recommended place");
      console.error(error);
    }
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">Image Upload</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full"
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

      <div>
        <label htmlFor="name" className="block mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="description" className="block mb-2">
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="during" className="block mb-2">
          Best Times to Visit
        </label>
        <input
          type="text"
          id="during"
          value={during}
          onChange={(e) => setDuring(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="hashtags" className="block mb-2">
          Hashtags
        </label>
        <input
          type="text"
          id="hashtags"
          value={hashtag}
          onChange={(e) => setHashtag(e.target.value)}
          onKeyDown={handleHashtagSubmit}
          className="w-full p-2 border rounded"
          placeholder="Type and press Enter to add"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {hashtags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded relative group user-select-none"
            >
              {tag}
              <button
                onClick={() => removeHashtag(tag)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-sm leading-none opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block mb-2">
          Location
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create Recommendation
      </button>
    </form>
  );
}
