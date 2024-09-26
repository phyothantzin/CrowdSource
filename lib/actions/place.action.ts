"use server";

import { connectDB } from "../mongoose";
import Place, { IPlace } from "@/database/place.model";
import User from "@/database/user.model";
import { error } from "console";
import { revalidatePath } from "next/cache";
import path from "path";
import { getUserById } from "./user.action";
import Interaction from "@/database/interaction.model";

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
    revalidatePath("/");
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
        { location: { $regex: new RegExp(searchQuery, "i") } },
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
    }).populate("user", "username image");
    if (!updatedPlace) throw new Error("Place not found");
    revalidatePath("/profile");
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

// Get recommended places
export async function getRecommendedPlaces(params: {
  userId: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}) {
  try {
    await connectDB();

    const { userId, page = 1, pageSize = 20, searchQuery } = params;

    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error("User not found");

    const skipAmount = (page - 1) * pageSize;

    // Get recent interactions
    const recentInteractions = await Interaction.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(50) // Increased limit to capture more interactions
      .exec();

    // Prioritize interactions
    const savedPlaces = recentInteractions
      .filter((interaction) => interaction.action === "save")
      .map((interaction) => interaction.place);

    const searchTerms = recentInteractions
      .filter((interaction) => interaction.action === "search")
      .flatMap((interaction) => interaction.search || []);

    const tags = recentInteractions
      .filter((interaction) => interaction.tags && interaction.tags.length > 0)
      .flatMap((interaction) => interaction.tags || []);

    // Count view interactions for each place
    const viewCounts = recentInteractions
      .filter((interaction) => interaction.action === "view")
      .reduce((acc, interaction) => {
        acc[interaction.place.toString()] =
          (acc[interaction.place.toString()] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    // Places viewed more than 10 times
    const frequentlyViewedPlaces = Object.entries(viewCounts)
      .filter(([_, count]) => (count as number) >= 10)
      .map(([placeId, _]) => placeId);

    let query: any = {
      $or: [
        { _id: { $in: savedPlaces } }, // Prioritize saved places
        {
          $or: [
            // Then search terms
            { name: { $regex: new RegExp(searchTerms.join("|"), "i") } },
            { description: { $regex: new RegExp(searchTerms.join("|"), "i") } },
          ],
        },
        { hashtags: { $in: tags } }, // Then tags
        { _id: { $in: frequentlyViewedPlaces } }, // Then frequently viewed places
      ],
      user: { $ne: user._id }, // Exclude the current user's own places
    };

    if (searchQuery) {
      query.$and = [
        {
          $or: [
            { name: { $regex: searchQuery, $options: "i" } },
            { description: { $regex: searchQuery, $options: "i" } },
            { location: { $regex: searchQuery, $options: "i" } },
          ],
        },
      ];
    }

    const totalPlaces = await Place.countDocuments(query);

    const recommendedPlaces = await Place.find(query)
      .populate({ path: "user", model: User, select: "username picture" })
      .skip(skipAmount)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    const isNext = totalPlaces > skipAmount + recommendedPlaces.length;

    // If no recommendations, fall back to recent places
    if (recommendedPlaces.length === 0) {
      const recentPlaces = await Place.find({ user: { $ne: user._id } })
        .populate({ path: "user", model: User, select: "username picture" })
        .skip(skipAmount)
        .limit(pageSize)
        .sort({ createdAt: -1 });

      return {
        places: recentPlaces,
        isNext: false,
      };
    }

    return {
      places: recommendedPlaces,
      isNext,
    };
  } catch (error: any) {
    console.error("Failed to fetch recommended places:", error);
    throw new Error(`Failed to fetch recommended places: ${error.message}`);
  }
}

// Track place interaction
export async function trackPlaceInteraction(params: {
  userId: string;
  placeId: string;
  action: string;
}) {
  try {
    await connectDB();
    const { userId, placeId, action } = params;

    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error("User not found");

    const place = await Place.findById(placeId);
    if (!place) throw new Error("Place not found");

    await Interaction.create({
      user: user._id,
      place: place._id,
      action,
      tags: place.hashtags,
    });
  } catch (error: any) {
    console.error("Failed to track place interaction:", error);
    throw new Error(`Failed to track place interaction: ${error.message}`);
  }
}

export async function trackSearchInteraction(params: {
  userId: string;
  searchQuery: string;
}) {
  try {
    await connectDB();
    const { userId, searchQuery } = params;

    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error("User not found");

    await Interaction.create({
      user: user._id,
      action: "search",
      search: [searchQuery],
    });
  } catch (error: any) {
    console.error("Failed to track search interaction:", error);
    throw new Error(`Failed to track search interaction: ${error.message}`);
  }
}
