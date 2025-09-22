import mongoose, { Schema, model, Types } from "mongoose";

const OrganizerSchema = new Schema({
    username: { type: String, required: true },
    clerkId: { type: String, required: true, unique: true },
    organizedEvents: [{ type: Types.ObjectId, ref: "Event" }], // optional for convenience
}, { timestamps: true });

export const OrganizerModel = model("Organizer", OrganizerSchema);