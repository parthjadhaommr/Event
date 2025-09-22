
import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";

interface Event {
    id: string;
    title: string;
    description: string;
    type: "music" | "tech" | "sports";
    date: string;
    time: string;
    ticketPrice: number;
    capacity: number;
    venueId: string;
}

// Dummy data
const dummyEvents: Event[] = [
    { id: "1", title: "Tech Conference 2025", description: "Latest in AI & Robotics", type: "tech", date: "2025-10-10", time: "10:00", ticketPrice: 100, capacity: 500, venueId: "v1" },
    { id: "2", title: "Music Festival", description: "Live bands & DJs", type: "music", date: "2025-11-05", time: "18:00", ticketPrice: 50, capacity: 1000, venueId: "v2" },
    { id: "3", title: "Local Sports Meet", description: "Football & basketball tournaments", type: "sports", date: "2025-12-01", time: "09:00", ticketPrice: 20, capacity: 300, venueId: "v3" },
    { id: "4", title: "AI Workshop", description: "Hands-on AI workshop", type: "tech", date: "2025-10-15", time: "14:00", ticketPrice: 80, capacity: 100, venueId: "v1" },
    { id: "5", title: "Rock Concert", description: "Famous rock bands", type: "music", date: "2025-11-10", time: "20:00", ticketPrice: 70, capacity: 700, venueId: "v2" },
    { id: "6", title: "Soccer Championship", description: "Regional soccer finals", type: "sports", date: "2025-12-05", time: "11:00", ticketPrice: 30, capacity: 400, venueId: "v3" },
    { id: "7", title: "Tech Meetup", description: "Networking for developers", type: "tech", date: "2025-10-20", time: "17:00", ticketPrice: 0, capacity: 150, venueId: "v1" },
    { id: "8", title: "Jazz Night", description: "Smooth jazz evening", type: "music", date: "2025-11-15", time: "19:00", ticketPrice: 40, capacity: 300, venueId: "v2" },
    { id: "9", title: "Basketball Tournament", description: "Citywide basketball", type: "sports", date: "2025-12-10", time: "10:00", ticketPrice: 25, capacity: 200, venueId: "v3" },
    { id: "10", title: "Tech Hackathon", description: "24-hour coding challenge", type: "tech", date: "2025-10-25", time: "09:00", ticketPrice: 50, capacity: 250, venueId: "v1" },
    { id: "11", title: "Pop Music Night", description: "Top pop artists live", type: "music", date: "2025-11-20", time: "21:00", ticketPrice: 60, capacity: 500, venueId: "v2" },
    { id: "12", title: "Marathon", description: "City marathon event", type: "sports", date: "2025-12-15", time: "06:00", ticketPrice: 15, capacity: 1000, venueId: "v3" },
    { id: "13", title: "Blockchain Seminar", description: "Learn about blockchain", type: "tech", date: "2025-10-30", time: "13:00", ticketPrice: 90, capacity: 120, venueId: "v1" },
    { id: "14", title: "Classical Music Evening", description: "Orchestra live performance", type: "music", date: "2025-11-25", time: "19:30", ticketPrice: 55, capacity: 350, venueId: "v2" },
    { id: "15", title: "Tennis Finals", description: "National tennis finals", type: "sports", date: "2025-12-20", time: "15:00", ticketPrice: 35, capacity: 250, venueId: "v3" },
];

const IndexTab = () => {
    const [events, setEvents] = useState<Event[]>(dummyEvents);

    const handleDelete = (id: string) => {
        Alert.alert("Delete Event", "Are you sure you want to delete this event?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => setEvents(events.filter((e) => e.id !== id)),
            },
        ]);
    };

    const handleEdit = (id: string) => {
        Alert.alert("Edit Event", `You can edit event with id: ${id}`);
        // Here you can open your Event Modal in "edit" mode
    };

    return (
        <ScrollView className="p-4 bg-gray-100 flex-1">
            {events.map((event) => (
                <View
                    key={event.id}
                    className="bg-white p-4 rounded mb-4 shadow-md flex-row justify-between items-center"
                >
                    <View className="flex-1">
                        <Text className="text-lg font-bold">{event.title}</Text>
                        <Text className="text-gray-500">{event.type.toUpperCase()}</Text>
                        <Text className="text-gray-500">{event.date} {event.time}</Text>
                        <Text className="text-gray-500">Price: ${event.ticketPrice}</Text>
                        <Text className="text-gray-500">Capacity: {event.capacity}</Text>
                    </View>

                    <View className="flex-row ml-2">
                        <Pressable
                            className="mr-2 bg-yellow-500 p-2 rounded"
                            onPress={() => handleEdit(event.id)}
                        >
                            <Feather name="edit" size={20} color="white" />
                        </Pressable>
                        <Pressable
                            className="bg-red-500 p-2 rounded"
                            onPress={() => handleDelete(event.id)}
                        >
                            <Feather name="trash-2" size={20} color="white" />
                        </Pressable>
                    </View>
                </View>
            ))}

            {events.length === 0 && (
                <Text className="text-center text-gray-500 mt-10">No events available.</Text>
            )}
        </ScrollView>
    );
};

export default IndexTab;
