"use server";

import { connectDB } from "../mongoose";
import Place, { IPlace } from "@/database/place.model";
import User from "@/database/user.model";
import { error } from "console";
import { revalidatePath } from "next/cache";
import path from "path";
import { getUserById } from "./user.action";

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
export async function getPlaces(params: {
  searchQuery?: string;
  page?: number;
  pageSize?: number;
  tag?: string;
}) {
  try {
    await connectDB();
    const { searchQuery = "", page = 1, pageSize = 10, tag = "" } = params;

    const skipAmount = (page - 1) * pageSize;

    let query: any = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { description: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    if (tag) {
      query.hashtags = { $in: tag };
    }

    const places = await Place.find(query)
      .populate({ path: "user", model: User })
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(pageSize);

    const totalPlaces = await Place.countDocuments(query);

    const isNext = totalPlaces > skipAmount + places.length;

    return { places, isNext };
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

    return places;
  } catch (error: any) {
    throw new Error(`Failed to fetch places: ${error.message}`);
  }
}

// Save a place
export async function savePlace(params: {
  userId: string;
  placeId: string;
  path: string;
}) {
  try {
    await connectDB();
    const { userId, placeId, path } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    const isPlaceSaved = user.saved.includes(placeId);

    if (isPlaceSaved) {
      await User.findByIdAndUpdate(
        user._id,
        { $pull: { saved: placeId } },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        user._id,
        { $addToSet: { saved: placeId } },
        { new: true }
      );
    }
    revalidatePath(path);
  } catch (error: any) {
    console.error("Failed to save place:", error);
    throw new Error(`Failed to save place: ${error.message}`);
  }
}
