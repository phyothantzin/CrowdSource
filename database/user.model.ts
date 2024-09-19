import { Schema, models, model, Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  username: string;
  email: string;
  password?: string;
  picture: string;
  location?: string;
  saved: Schema.Types.ObjectId[];
  joinedAt: Date;
}

const UserSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  picture: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  saved: [
    {
      type: Schema.Types.ObjectId,
      ref: "Place",
    },
  ],
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = models.User || model<IUser>("User", UserSchema);
export default User;
