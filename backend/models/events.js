import mongoose, { Schema, model, Types } from "mongoose";

const EventSchema = new Schema({
    event_type: {
        type: String,
        enum: ["music", "tech", "sport"],
        required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    venueId: { type: Types.ObjectId, ref: "Venue", required: true },
    date: { type: String, required: true }, // could also use Date type
    time: { type: String, required: true },
    ticketPrice: { type: String },
    capacity: { type: Number, required: true },
    soldTickets: { type: Number, default: 0 },
    imageURL: { type: String },
    userIds: [{ type: Types.ObjectId, ref: "User" }], // attendees
    organizerId: { type: Types.ObjectId, ref: "Organizer" }, // easier than linking event to organizer separately
}, { timestamps: true });

export const EventModel = model("Event", EventSchema);
