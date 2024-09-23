"use server";

import User from "@/database/user.model";
import { connectDB } from "../mongoose";
import Place from "@/database/place.model";
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

export async function createUser(userData: any) {
  try {
    connectDB();
    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    console.log(error);
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
    console.log(error);
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

    // Delete user from db and questions, answers, comments, etc...
    // const userQuestionIds = await Question.find({ author: user._id }).distinct(
    //   "_id"
    // );

    // await Place.deleteMany({ author: user._id });

    await User.findByIdAndDelete(user._id);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
