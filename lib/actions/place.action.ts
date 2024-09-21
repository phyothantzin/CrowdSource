"use server";

import { connectDB } from "../mongoose";
import Place, { IPlace } from "@/database/place.model";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

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
      .populate({ path: "user", model: User }) // Populate user with name and image
      .sort({ createdAt: -1 });

    // Serialize the places
    const serializedPlaces = places.map((place) => ({
      _id: place._id.toString(),
      name: place.name,
      description: place.description,
      during: place.during,
      location: place.location,
      hashtags: place.hashtags,
      image: place.image,
      user: {
        _id: place.user._id.toString(),
        clerkId: place.user.clerkId,
        username: place.user.username,
        picture: place.user.picture,
      },
      createdAt: place.createdAt.toISOString(),
      updatedAt: place.updatedAt.toISOString(),
    }));

    return serializedPlaces;
  } catch (error: any) {
    throw new Error(`Failed to fetch places: ${error.message}`);
  }
}

// Get a single place by ID
export async function getPlaceById(params: { id: string }) {
  try {
    const { id } = params;
    await connectDB();
    const place = await Place.findById(id)
      .populate({ path: "user", model: User })
      .sort({ createdAt: -1 });

    if (!place) {
      throw new Error("Place not found");
    }

    // Serialize the place
    const serializedPlace = {
      _id: place._id.toString(),
      name: place.name,
      description: place.description,
      during: place.during,
      location: place.location,
      hashtags: place.hashtags,
      image: place.image,
      user: {
        _id: place.user._id.toString(),
        clerkId: place.user.clerkId,
        username: place.user.username,
        picture: place.user.picture,
      },
      createdAt: place.createdAt.toISOString(),
      updatedAt: place.updatedAt.toISOString(),
    };

    return serializedPlace;
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

// Get places by user ID
export async function getPlacesByUserId(params: { userId: string }) {
  try {
    const { userId } = params;
    await connectDB();
    const places = await Place.find({ user: userId })
      .populate({ path: "user", model: User })
      .sort({ createdAt: -1 });

    const serializedPlaces = places.map((place) => ({
      _id: place._id.toString(),
      name: place.name,
      description: place.description,
      during: place.during,
      location: place.location,
      hashtags: place.hashtags,
      image: place.image,
      user: {
        _id: place.user._id.toString(),
        clerkId: place.user.clerkId,
        username: place.user.username,
        picture: place.user.picture,
      },

      createdAt: place.createdAt.toISOString(),
      updatedAt: place.updatedAt.toISOString(),
    }));

    return serializedPlaces;
  } catch (error: any) {
    throw new Error(`Failed to fetch places: ${error.message}`);
  }
}
