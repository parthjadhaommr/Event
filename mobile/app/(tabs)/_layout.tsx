// app/(tabs)/_layout.tsx
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";
import { View, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";

import EventModal from "@/components/EventModal";
import VenueModal from "@/components/VenueModal";

const TabsLayout = () => {
    const insets = useSafeAreaInsets();
    const { isSignedIn } = useAuth();

    const [eventModalVisible, setEventModalVisible] = useState(false);
    const [venueModalVisible, setVenueModalVisible] = useState(false);

    // Dummy venues list
    const [venues] = useState<{ _id: string; name: string }[]>([
        { _id: "v1", name: "Grand Hall" },
        { _id: "v2", name: "Open Arena" },
    ]);

    // Forms (shared across modals for add/edit)
    const eventForm = useForm();
    const venueForm = useForm();

    if (!isSignedIn) return <Redirect href="./(auth)" />;

    // Handlers
    const handleEventSubmit = (data: any) => {
        console.log("Submitted Event:", data);
        eventForm.reset();
        setEventModalVisible(false);
    };

    const handleVenueSubmit = (data: any) => {
        console.log("Submitted Venue:", data);
        venueForm.reset();
        setVenueModalVisible(false);
    };

    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: "#1DA1F2",
                    tabBarInactiveTintColor: "#657786",
                    tabBarStyle: {
                        backgroundColor: "#fff",
                        borderTopWidth: 1,
                        borderTopColor: "#E1E8ED",
                        height: 60 + insets.bottom,
                        paddingTop: 8,
                    },
                }}
            >
                {/* Home / Events */}
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Home",
                        tabBarIcon: ({ color, size }) => (
                            <Feather name="home" size={size} color={color} />
                        ),
                        headerRight: () => (
                            <View className="flex-row mr-3">
                                <TouchableOpacity
                                    className="mx-2"
                                    onPress={() => setEventModalVisible(true)}
                                >
                                    <Feather name="plus" size={22} color="#1DA1F2" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="mx-2"
                                    onPress={() => console.log("Exit pressed")}
                                >
                                    <Feather name="log-out" size={22} color="red" />
                                </TouchableOpacity>
                            </View>
                        ),
                    }}
                />

                {/* Venues */}
                <Tabs.Screen
                    name="venue"
                    options={{
                        title: "Venue",
                        tabBarIcon: ({ color, size }) => (
                            <Feather name="map-pin" size={size} color={color} />
                        ),
                        headerRight: () => (
                            <View className="flex-row mr-3">
                                <TouchableOpacity
                                    className="mx-2"
                                    onPress={() => setVenueModalVisible(true)}
                                >
                                    <Feather name="plus" size={22} color="#1DA1F2" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="mx-2"
                                    onPress={() => console.log("Exit pressed")}
                                >
                                    <Feather name="log-out" size={22} color="red" />
                                </TouchableOpacity>
                            </View>
                        ),
                    }}
                />
            </Tabs>

            {/* Event Modal */}
            <EventModal
                visible={eventModalVisible}
                onClose={() => setEventModalVisible(false)}
                venues={venues}
                form={eventForm}
                onSubmit={handleEventSubmit}
            />

            {/* Venue Modal */}
            <VenueModal
                visible={venueModalVisible}
                onClose={() => setVenueModalVisible(false)}
                form={venueForm}
                onSubmit={handleVenueSubmit}
            />
        </>
    );
};

export default TabsLayout;
