import { Schema, models, model, Document } from "mongoose";

export interface IInteraction extends Document {
  user: Schema.Types.ObjectId;
  action: string;
  place: Schema.Types.ObjectId;
  search: string[];
  tags: string[];
  createdAt: Date;
}

const InteractionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  place: {
    type: Schema.Types.ObjectId,
    ref: "Place",
  },
  search: [String],
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Interaction =
  models.Interaction || model<IInteraction>("Interaction", InteractionSchema);
export default Interaction;
