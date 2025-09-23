import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";

import { VenueModel } from "./models/venue.js";
import { EventModel } from "./models/events.js";
import { UserModel } from "./models/user.js";
import { OrganizerModel } from "./models/organizer.js";

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/event-management";

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://ritanshu:ritanshu11@event.dvdlgpm.mongodb.net/");
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection failed", err);
        process.exit(1);
    }
};

// Configure Cloudinary v2
cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

// Multer memory storage
const storage = multer.memoryStorage();
const parser = multer({ storage });

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Event Management API running", status: "healthy" }));

// ==================== VENUE ROUTES ====================
app.get("/venues", async (req, res) => {
    try {
        const venues = await VenueModel.find().sort({ name: 1 }); // use VenueModel
        res.status(200).json(venues);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch venues" });
    }
});

app.post("/addVenue", async (req, res) => {
    try {
        const venue = await VenueModel.create(req.body);
        res.status(201).json(venue);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.get("/listVenues", async (req, res) => res.json(await VenueModel.find()));
app.get("/getVenue/:id", async (req, res) => {
    const v = await VenueModel.findById(req.params.id);
    if (!v) return res.status(404).json({ error: "Venue not found" });
    res.json(v);
});

app.put("/updateVenues/:id", async (req, res) => {
    const v = await VenueModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!v) return res.status(404).json({ error: "Venue not found" });
    res.json(v);
});

app.delete("/deleteVenues/:id", async (req, res) => {
    const v = await VenueModel.findByIdAndDelete(req.params.id);
    if (!v) return res.status(404).json({ error: "Venue not found" });
    res.json({ message: "Venue deleted" });
});

// ==================== EVENT ROUTES ====================

// Helper: upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder = "event_images") => {
    return new Promise < string > ((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (result) resolve(result.secure_url);
                else reject(error);
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
};

app.post("/addEvents", parser.single("image"), async (req, res) => {
    try {
        let imageURL = "";
        if (req.file) imageURL = await uploadToCloudinary(req.file.buffer);

        const eventData = { ...req.body, imageURL };
        const e = await EventModel.create(eventData);
        res.status(201).json(e);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.put("/editEvents/:id", parser.single("image"), async (req, res) => {
    try {
        let imageURL = "";
        if (req.file) imageURL = await uploadToCloudinary(req.file.buffer);

        const eventData = { ...req.body };
        if (imageURL) eventData.imageURL = imageURL;

        const e = await EventModel.findByIdAndUpdate(req.params.id, eventData, { new: true });
        if (!e) return res.status(404).json({ error: "Event not found" });
        res.json(e);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.get("/listEvents", async (req, res) => {
    res.json(await EventModel.find().populate("venueId").populate("userIds").populate("organizerId"));
});

app.get("/getEvents/:id", async (req, res) => {
    const e = await EventModel.findById(req.params.id)
        .populate("venueId")
        .populate("userIds")
        .populate("organizerId");
    if (!e) return res.status(404).json({ error: "Event not found" });
    res.json(e);
});

app.delete("/deleteEvents/:id", async (req, res) => {
    try {
        console.log("Delete request received for ID:", req.params.id); // 👈 log here
        const event = await EventModel.findByIdAndDelete(req.params.id);
        if (!event) {
            console.log("Event not found for ID:", req.params.id);
            return res.status(404).json({ error: "Event not found" });
        }
        console.log("Event deleted:", event._id);
        res.json({ success: true, deletedId: event._id });
    } catch (err) {
        console.error("Error deleting event:", err);
        res.status(500).json({ error: "Failed to delete event" });
    }
});

// Event registration
app.post("/events/:id/register", async (req, res) => {
    const { userId } = req.body;
    const event = await EventModel.findById(req.params.id);
    const user = await UserModel.findById(userId);
    if (!event || !user) return res.status(404).json({ error: "Event or User not found" });
    if (event.soldTickets >= event.capacity) return res.status(400).json({ error: "Event full" });
    if (event.userIds.includes(userId)) return res.status(400).json({ error: "User already registered" });

    event.userIds.push(userId);
    event.soldTickets += 1;
    await event.save();

    user.attendingEvents.push(event._id);
    await user.save();

    res.json({ message: "User registered successfully", event, user });
});

connectDB().then(() => {
    if (NODE_ENV !== "production") {
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    }
});

export default app;
