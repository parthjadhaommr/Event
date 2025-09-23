import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import EventModal from "@/components/EventModal";
const API_BASE = "http://localhost:5000"

interface Event {
    _id: string;
    title: string;
    description: string;
    type: "music" | "tech" | "sports";
    date: string;
    time: string;
    ticketPrice: number;
    capacity: number;
    venueId: string;
    imageURL?: string;
}

const IndexTab = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const form = useForm({
        defaultValues: {
            title: "",
            description: "",
            type: "",
            date: "",
            time: "",
            ticketPrice: 0,
            capacity: 0,
            venueId: "",
        },
    });

    // Fetch all events
    const fetchEvents = async () => {
        try {
            const res = await fetch(`${API_BASE}/listEvents`);
            if (!res.ok) throw new Error("Failed to fetch events");
            const data = await res.json();
            setEvents(data);
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Unable to fetch events");
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Delete event
    const handleDelete = async (id: string) => {
        Alert.alert("Delete Event", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        console.log("Deleting:", id);
                        const res = await fetch(`${API_BASE}/deleteEvents/${id}`, {
                            method: "DELETE",
                        });
                        if (res.ok) {
                            setEvents((prev) => prev.filter((e) => e._id !== id));
                            Alert.alert("Deleted", "Event deleted successfully");
                        } else {
                            const errData = await res.json();
                            Alert.alert("Error", errData.error || "Failed to delete event");
                        }
                    } catch (err) {
                        console.error(err);
                        Alert.alert("Error", "Could not connect to backend");
                    }
                },
            },
        ]);
    };

    // Edit
    const handleEdit = (event: Event) => {
        setSelectedEvent(event);
        form.reset({ ...event });
        setModalVisible(true);
    };

    const handleFormSubmit = async (data: any) => {
        if (!selectedEvent) return;

        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }

        try {
            const res = await fetch(`${API_BASE}/editEvents/${selectedEvent._id}`, {
                method: "PUT",
                body: formData,
            });
            const updatedEvent = await res.json();
            if (res.ok) {
                Alert.alert("Success", "Event updated successfully");
                setModalVisible(false);
                setSelectedEvent(null);
                fetchEvents();
            } else {
                Alert.alert("Error", updatedEvent.error || "Failed to update event");
            }
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to update event");
        }
    };

    return (
        <View className="flex-1 bg-gray-100">
            <ScrollView className="p-4">
                {events.length > 0 ? (
                    events.map((event) => (
                        <View
                            key={event._id}
                            className="bg-white p-4 rounded mb-4 shadow-md flex-row justify-between items-center"
                        >
                            <View className="flex-1">
                                <Text className="text-lg font-bold">{event.title}</Text>
                                <Text className="text-gray-500">{event.type?.toUpperCase()}</Text>
                                <Text className="text-gray-500">
                                    {event.date} {event.time}
                                </Text>
                                <Text className="text-gray-500">Price: ${event.ticketPrice}</Text>
                                <Text className="text-gray-500">Capacity: {event.capacity}</Text>
                            </View>

                            <View className="flex-row ml-2">
                                <Pressable
                                    className="mr-2 bg-yellow-500 p-2 rounded"
                                    onPress={() => handleEdit(event)}
                                >
                                    <Feather name="edit" size={20} color="white" />
                                </Pressable>
                                <Pressable
                                    className="bg-red-500 p-2 rounded"
                                    onPress={() => handleDelete(event._id)}
                                >
                                    <Feather name="trash-2" size={20} color="white" />
                                </Pressable>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text className="text-center text-gray-500 mt-10">No events available.</Text>
                )}
            </ScrollView>

            {modalVisible && (
                <EventModal
                    visible={modalVisible}
                    onClose={() => {
                        setModalVisible(false);
                        setSelectedEvent(null);
                    }}
                    form={form}
                    onSubmit={handleFormSubmit}
                />
            )}
        </View>
    );
};

export default IndexTab;
