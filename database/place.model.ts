import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IPlace extends Document {
  name: string;
  description?: string;
  during?: string;
  location: string;
  hashtags: string[];
  image: string;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PlaceSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    during: { type: String },
    location: { type: String, required: true },
    hashtags: [{ type: String }],
    image: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Place = models.Place || model<IPlace>("Place", PlaceSchema);
export default Place;
