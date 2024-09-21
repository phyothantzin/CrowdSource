"use client";

import { useState } from "react";
import { deletePlace } from "@/lib/actions/place.action";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";

export default function DeleteConfirmationDialog({
  placeId,
}: {
  placeId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deletePlace(placeId);
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete place:", error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
      >
        <FaTrash className="mr-2" /> Delete
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete this recommendation?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
