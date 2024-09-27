"use server";

import User from "@/database/user.model";
import { connectDB } from "../mongoose";
import Place from "@/database/place.model";
import mongoose from "mongoose";
import Interaction from "@/database/interaction.model";
// import { revalidatePath } from "next/cache";

export async function getUserById(userId: string) {
  try {
    connectDB();
    const user = await User.findOne({ clerkId: userId })
      .populate({
        path: "saved",
        model: Place,
      })
      .sort({ createdAt: -1 });

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUserSavedPlaces(userId: string) {
  try {
    connectDB();
    const user = await User.findOne({ clerkId: userId })
      .populate({
        path: "saved",
        model: Place,
        populate: {
          path: "user",
          model: User,
          select: "username picture",
        },
      })
      .sort({ createdAt: -1 });

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createUser(userData: any) {
  try {
    connectDB();
    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    throw error;
  }
}

export async function updateUser(params: any) {
  try {
    connectDB();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteUser(params: any) {
  try {
    connectDB();

    const { clerkId } = params;

    const user = await User.findOne({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // Delete associated interactions
    await Interaction.deleteMany({ user: user._id });

    // Delete user's places
    await Place.deleteMany({ user: user._id });

    // Delete the user
    await User.findByIdAndDelete(user._id);
  } catch (error) {
    throw error;
  }
}
