import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";
import { View, TouchableOpacity, Modal, Text, ScrollView, TextInput, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import EventModal from "@/components/EventModel"; // Modular Event Modal
import { Picker } from "@react-native-picker/picker";

const TabsLayout = () => {
    const insets = useSafeAreaInsets();
    const { isSignedIn } = useAuth();

    const [eventModalVisible, setEventModalVisible] = useState(false);
    const [venueModalVisible, setVenueModalVisible] = useState(false);

    const [venues, setVenues] = useState<{ _id: string; name: string }[]>([
        { _id: "v1", name: "Grand Hall" },
        { _id: "v2", name: "Open Arena" },
    ]); // Example dummy data

    // React Hook Form instances
    const eventForm = useForm();
    const venueForm = useForm();

    if (!isSignedIn) return <Redirect href="./(auth)" />;

    // Submit Handlers
    const handleEventSubmit = (data: any) => {
        console.log("Submitted Event:", data);
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
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Home",
                        tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
                        headerRight: () => (
                            <View className="flex-row mr-3">
                                <TouchableOpacity className="mx-2" onPress={() => setEventModalVisible(true)}>
                                    <Feather name="plus" size={22} color="#1DA1F2" />
                                </TouchableOpacity>
                                <TouchableOpacity className="mx-2" onPress={() => console.log("Exit pressed")}>
                                    <Feather name="log-out" size={22} color="red" />
                                </TouchableOpacity>
                            </View>
                        ),
                    }}
                />

                <Tabs.Screen
                    name="venue"
                    options={{
                        title: "Venue",
                        tabBarIcon: ({ color, size }) => <Feather name="map-pin" size={size} color={color} />,
                        headerRight: () => (
                            <View className="flex-row mr-3">
                                <TouchableOpacity className="mx-2" onPress={() => setVenueModalVisible(true)}>
                                    <Feather name="plus" size={22} color="#1DA1F2" />
                                </TouchableOpacity>
                                <TouchableOpacity className="mx-2" onPress={() => console.log("Exit pressed")}>
                                    <Feather name="log-out" size={22} color="red" />
                                </TouchableOpacity>
                            </View>
                        ),
                    }}
                />
            </Tabs>

            {/* Event Modal (Full-screen & Modular) */}
            <EventModal
                visible={eventModalVisible}
                onClose={() => setEventModalVisible(false)}
                venues={venues}
                form={eventForm}
                onSubmit={handleEventSubmit}
            />

            {/* Venue Modal */}
            <Modal
                animationType="slide"
                transparent={false} // Full screen
                visible={venueModalVisible}
                onRequestClose={() => setVenueModalVisible(false)}
            >
                <View className="flex-1 bg-white">
                    <ScrollView className="p-6">
                        <Text className="text-2xl font-bold mb-4">Add New Venue</Text>

                        <Text className="mb-1">Name</Text>
                        <Controller
                            control={venueForm.control}
                            name="name"
                            defaultValue=""
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    className="border p-2 mb-3 rounded"
                                    placeholder="Venue Name"
                                    value={value}
                                    onChangeText={onChange}
                                />
                            )}
                        />

                        <Text className="mb-1">Address</Text>
                        <Controller
                            control={venueForm.control}
                            name="address"
                            defaultValue=""
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    className="border p-2 mb-3 rounded"
                                    placeholder="Venue Address"
                                    value={value}
                                    onChangeText={onChange}
                                />
                            )}
                        />

                        <Text className="mb-1">Capacity</Text>
                        <Controller
                            control={venueForm.control}
                            name="capacity"
                            defaultValue=""
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    className="border p-2 mb-3 rounded"
                                    placeholder="Capacity"
                                    value={value}
                                    onChangeText={onChange}
                                    keyboardType="numeric"
                                />
                            )}
                        />

                        <Pressable
                            className="bg-blue-500 p-3 rounded mb-2"
                            onPress={venueForm.handleSubmit(handleVenueSubmit)}
                        >
                            <Text className="text-white text-center font-bold">Add Venue</Text>
                        </Pressable>

                        <Pressable
                            className="bg-gray-300 p-3 rounded"
                            onPress={() => setVenueModalVisible(false)}
                        >
                            <Text className="text-center font-bold">Cancel</Text>
                        </Pressable>
                    </ScrollView>
                </View>
            </Modal>
        </>
    );
};

export default TabsLayout;
