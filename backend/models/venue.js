import mongoose, { Schema, model, Types } from "mongoose";

const VenueSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    capacity: { type: Number, required: true },
}, { timestamps: true });

export const VenueModel = model("Venue", VenueSchema);