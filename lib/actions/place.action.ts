"use server";

import { connectDB } from "../mongoose";
import Place, { IPlace } from "@/database/place.model";
import { revalidatePath } from "next/cache";

// Get the Place model

// Create a new place
export async function createPlace(params: any) {
  try {
    await connectDB();
    const { name, description, during, location, hashtags, image, user } =
      params;
    const newPlace = await Place.create({
      name,
      description,
      during,
      location,
      hashtags,
      image,
      user,
    });
    return newPlace;
  } catch (error: any) {
    console.error("Failed to create place:", error);
    throw new Error(`Failed to create place: ${error.message}`);
  }
}

// Get all places
export async function getPlaces() {
  try {
    await connectDB();
    const places = await Place.find()
      .populate("user", "username image") // Populate user with name and image
      .sort({ createdAt: -1 });
    return places;
  } catch (error: any) {
    throw new Error(`Failed to fetch places: ${error.message}`);
  }
}

// Get a single place by ID
export async function getPlaceById(id: string) {
  try {
    await connectDB();
    const place = await Place.findById(id).populate("user", "username image");
    if (!place) throw new Error("Place not found");
    return place;
  } catch (error: any) {
    throw new Error(`Failed to fetch place: ${error.message}`);
  }
}

// Update a place
export async function updatePlace(id: string, updateData: Partial<IPlace>) {
  try {
    await connectDB();
    const updatedPlace = await Place.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("user", "username image");
    if (!updatedPlace) throw new Error("Place not found");
    revalidatePath("/places"); // Adjust the path as needed
    return updatedPlace;
  } catch (error: any) {
    throw new Error(`Failed to update place: ${error.message}`);
  }
}

// Delete a place
export async function deletePlace(id: string) {
  try {
    await connectDB();
    const deletedPlace = await Place.findByIdAndDelete(id);
    if (!deletedPlace) throw new Error("Place not found");
    revalidatePath("/places"); // Adjust the path as needed
    return deletedPlace;
  } catch (error: any) {
    throw new Error(`Failed to delete place: ${error.message}`);
  }
}
