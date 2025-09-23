// components/EventModal.tsx
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Modal,
    ScrollView,
    TextInput,
    Pressable,
    Alert,
    ActivityIndicator,
    Image,
} from "react-native";
import { Controller, UseFormReturn } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

interface Venue {
    _id: string;
    name: string;
}

interface EventModalProps {
    visible: boolean;
    onClose: () => void;
    form: UseFormReturn<any>;
    onSubmit?: (data: any) => void; // optional if using API inside modal
    event?: any; // optional for edit
}

const EventModal: React.FC<EventModalProps> = ({ visible, onClose, form, event }) => {
    const { control, handleSubmit, reset } = form;
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [loadingVenues, setLoadingVenues] = useState(false);

    // Pre-fill form for edit
    useEffect(() => {
        if (event) {
            reset({
                title: event.title,
                description: event.description,
                venueId: event.venueId?._id || event.venueId || "",
                event_type: event.event_type || event.type,
                date: event.date,
                time: event.time,
                ticketPrice: event.ticketPrice,
                capacity: event.capacity,
            });
            setSelectedImage(event.imageURL || null);
        } else {
            reset({});
            setSelectedImage(null);
        }
    }, [event, reset]);

    // Fetch venues when modal opens
    useEffect(() => {
        if (!visible) return;
        const fetchVenues = async () => {
            setLoadingVenues(true);
            try {
                const res = await fetch("http://localhost:5000/venues");
                const data = await res.json();
                if (res.ok) setVenues(data);
                else Alert.alert("Error", data.error || "Failed to fetch venues");
            } catch (err) {
                console.error(err);
                Alert.alert("Error", "Failed to fetch venues");
            } finally {
                setLoadingVenues(false);
            }
        };
        fetchVenues();
    }, [visible]);

    const handleImagePicker = async (useCamera: boolean = false) => {
        const permissionResult = useCamera
            ? await ImagePicker.requestCameraPermissionsAsync()
            : await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.status !== "granted") {
            Alert.alert(
                "Permission needed",
                `Please grant permission to access your ${useCamera ? "camera" : "photo library"}`
            );
            return;
        }

        const pickerOptions = { allowsEditing: true, aspect: [16, 9] as [number, number], quality: 0.8 };
        const result = useCamera
            ? await ImagePicker.launchCameraAsync(pickerOptions)
            : await ImagePicker.launchImageLibraryAsync({ ...pickerOptions, mediaTypes: ImagePicker.MediaTypeOptions.Images });

        if (!result.canceled && result.assets) setSelectedImage(result.assets[0].uri);
    };

    const handleFormSubmit = async (data: any) => {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("venueId", data.venueId);
            formData.append("event_type", data.event_type); // backend enum
            formData.append("date", data.date);
            formData.append("time", data.time);
            formData.append("ticketPrice", data.ticketPrice.toString());
            formData.append("capacity", data.capacity.toString());

            if (selectedImage) {
                const filename = selectedImage.split("/").pop();
                const match = /\.(\w+)$/.exec(filename ?? "");
                const type = match ? `image/${match[1]}` : "image";
                formData.append("image", { uri: selectedImage, name: filename, type } as any);
            }

            const url = event ? `http://localhost:5000/editEvents/${event._id}` : "http://localhost:5000/addEvents";
            const method = event ? "PUT" : "POST";

            const response = await fetch(url, { method, body: formData });
            const result = await response.json();

            if (response.ok) {
                Alert.alert("Success", event ? "Event updated successfully" : "Event added successfully");
                reset();
                setSelectedImage(null);
                onClose();
            } else {
                Alert.alert("Error", result.error || "Something went wrong");
            }
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Unable to submit event");
        }
    };

    return (
        <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
            <View className="flex-1 bg-white">
                <ScrollView className="p-6">
                    <Text className="text-2xl font-bold mb-4">
                        {event ? "Edit Event" : "Add New Event"}
                    </Text>

                    {/* Banner Picker */}
                    <Pressable
                        className="bg-gray-200 h-40 mb-4 justify-center items-center rounded"
                        onPress={() => handleImagePicker(false)}
                    >
                        {selectedImage ? (
                            <Image source={{ uri: selectedImage }} style={{ width: "100%", height: "100%", borderRadius: 8 }} />
                        ) : (
                            <Text>Pick Banner Image</Text>
                        )}
                    </Pressable>

                    {/* Title */}
                    <Text className="mb-1">Title</Text>
                    <Controller
                        control={control}
                        name="title"
                        defaultValue=""
                        render={({ field: { onChange, value } }) => (
                            <TextInput className="border p-2 mb-3 rounded" placeholder="Event Title" value={value || ""} onChangeText={onChange} />
                        )}
                    />

                    {/* Description */}
                    <Text className="mb-1">Description</Text>
                    <Controller
                        control={control}
                        name="description"
                        defaultValue=""
                        render={({ field: { onChange, value } }) => (
                            <TextInput className="border p-2 mb-3 rounded" placeholder="Event Description" value={value || ""} onChangeText={onChange} multiline />
                        )}
                    />

                    {/* Venue Picker */}
                    <Text className="mb-1">Venue</Text>
                    <Controller
                        control={control}
                        name="venueId"
                        defaultValue=""
                        render={({ field: { onChange, value } }) => (
                            <View className="border rounded mb-3">
                                {loadingVenues ? (
                                    <ActivityIndicator size="small" color="#0000ff" />
                                ) : (
                                    <Picker selectedValue={value || ""} onValueChange={onChange}>
                                        <Picker.Item label="Select a Venue" value="" />
                                        {venues.map((v) => <Picker.Item key={v._id} label={v.name} value={v._id} />)}
                                    </Picker>
                                )}
                            </View>
                        )}
                    />

                    {/* Event Type */}
                    <Text className="mb-1">Type</Text>
                    <Controller
                        control={control}
                        name="event_type"
                        defaultValue=""
                        render={({ field: { onChange, value } }) => (
                            <View className="border rounded mb-3">
                                <Picker selectedValue={value || ""} onValueChange={onChange}>
                                    <Picker.Item label="Select Type" value="" />
                                    <Picker.Item label="Music" value="music" />
                                    <Picker.Item label="Tech" value="tech" />
                                    <Picker.Item label="Sports" value="sports" />
                                </Picker>
                            </View>
                        )}
                    />

                    {/* Date */}
                    <Text className="mb-1">Date</Text>
                    <Controller
                        control={control}
                        name="date"
                        defaultValue=""
                        render={({ field: { onChange, value } }) => (
                            <TextInput className="border p-2 mb-3 rounded" placeholder="YYYY-MM-DD" value={value || ""} onChangeText={onChange} />
                        )}
                    />

                    {/* Time */}
                    <Text className="mb-1">Time</Text>
                    <Controller
                        control={control}
                        name="time"
                        defaultValue=""
                        render={({ field: { onChange, value } }) => (
                            <TextInput className="border p-2 mb-3 rounded" placeholder="HH:MM" value={value || ""} onChangeText={onChange} />
                        )}
                    />

                    {/* Ticket Price */}
                    <Text className="mb-1">Ticket Price</Text>
                    <Controller
                        control={control}
                        name="ticketPrice"
                        defaultValue=""
                        render={({ field: { onChange, value } }) => (
                            <TextInput className="border p-2 mb-3 rounded" placeholder="Ticket Price" keyboardType="numeric" value={value ? String(value) : ""} onChangeText={(text) => onChange(Number(text))} />
                        )}
                    />

                    {/* Capacity */}
                    <Text className="mb-1">Capacity</Text>
                    <Controller
                        control={control}
                        name="capacity"
                        defaultValue=""
                        render={({ field: { onChange, value } }) => (
                            <TextInput className="border p-2 mb-3 rounded" placeholder="Capacity" keyboardType="numeric" value={value ? String(value) : ""} onChangeText={(text) => onChange(Number(text))} />
                        )}
                    />

                    {/* Buttons */}
                    <Pressable className="bg-blue-500 p-3 rounded mb-2" onPress={handleSubmit(handleFormSubmit)}>
                        <Text className="text-white text-center font-bold">{event ? "Update Event" : "Add Event"}</Text>
                    </Pressable>
                    <Pressable className="bg-gray-300 p-3 rounded" onPress={onClose}>
                        <Text className="text-center font-bold">Cancel</Text>
                    </Pressable>
                </ScrollView>
            </View>
        </Modal>
    );
};

export default EventModal;
