import React, { useState } from "react";
import { View, Text, Modal, ScrollView, TextInput, Pressable, Alert } from "react-native";
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
    venues: Venue[];
    form: UseFormReturn<any>;
    onSubmit: (data: any) => void;
}

const EventModal: React.FC<EventModalProps> = ({ visible, onClose, venues, form, onSubmit }) => {
    const { control, handleSubmit, reset } = form;
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImagePicker = async (useCamera: boolean = false) => {
        const permissionResult = useCamera
            ? await ImagePicker.requestCameraPermissionsAsync()
            : await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.status !== "granted") {
            const source = useCamera ? "camera" : "photo library";
            Alert.alert("Permission needed", `Please grant permission to access your ${source}`);
            return;
        }

        const pickerOptions = { allowsEditing: true, aspect: [16, 9] as [number, number], quality: 0.8 };

        const result = useCamera
            ? await ImagePicker.launchCameraAsync(pickerOptions)
            : await ImagePicker.launchImageLibraryAsync({
                ...pickerOptions,
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
            });

        if (!result.canceled && result.assets) setSelectedImage(result.assets[0].uri);
    };

    const handleFormSubmit = (data: any) => {
        onSubmit({ ...data, banner: selectedImage });
        reset();
        setSelectedImage(null);
    };

    return (
        <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
            <View className="flex-1 bg-white">
                <ScrollView className="p-6">
                    <Text className="text-2xl font-bold mb-4">Add New Event</Text>

                    {/* Banner Picker */}
                    <Pressable
                        className="bg-gray-200 h-40 mb-4 justify-center items-center rounded"
                        onPress={() => handleImagePicker(false)}
                    >
                        <Text>{selectedImage ? "Change Banner" : "Pick Banner Image"}</Text>
                    </Pressable>

                    {/* Title */}
                    <Text className="mb-1">Title</Text>
                    <Controller
                        control={control}
                        name="title"
                        defaultValue=""
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                className="border p-2 mb-3 rounded"
                                placeholder="Event Title"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />

                    {/* Description */}
                    <Text className="mb-1">Description</Text>
                    <Controller
                        control={control}
                        name="description"
                        defaultValue=""
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                className="border p-2 mb-3 rounded"
                                placeholder="Event Description"
                                value={value}
                                onChangeText={onChange}
                                multiline
                            />
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
                                <Picker selectedValue={value} onValueChange={onChange}>
                                    <Picker.Item label="Select a Venue" value="" />
                                    {venues.map((v) => (
                                        <Picker.Item key={v._id} label={v.name} value={v._id} />
                                    ))}
                                </Picker>
                            </View>
                        )}
                    />

                    {/* Type */}
                    <Text className="mb-1">Type</Text>
                    <Controller
                        control={control}
                        name="type"
                        defaultValue=""
                        render={({ field: { onChange, value } }) => (
                            <View className="border rounded mb-3">
                                <Picker selectedValue={value} onValueChange={onChange}>
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
                            <TextInput className="border p-2 mb-3 rounded" placeholder="YYYY-MM-DD" value={value} onChangeText={onChange} />
                        )}
                    />

                    {/* Time */}
                    <Text className="mb-1">Time</Text>
                    <Controller
                        control={control}
                        name="time"
                        defaultValue=""
                        render={({ field: { onChange, value } }) => (
                            <TextInput className="border p-2 mb-3 rounded" placeholder="HH:MM" value={value} onChangeText={onChange} />
                        )}
                    />

                    {/* Ticket Price */}
                    <Text className="mb-1">Ticket Price</Text>
                    <Controller
                        control={control}
                        name="ticketPrice"
                        defaultValue=""
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                className="border p-2 mb-3 rounded"
                                placeholder="Ticket Price"
                                keyboardType="numeric"
                                value={value.toString()}
                                onChangeText={(text) => onChange(Number(text))}
                            />
                        )}
                    />

                    {/* Capacity */}
                    <Text className="mb-1">Capacity</Text>
                    <Controller
                        control={control}
                        name="capacity"
                        defaultValue=""
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                className="border p-2 mb-3 rounded"
                                placeholder="Capacity"
                                keyboardType="numeric"
                                value={value.toString()}
                                onChangeText={(text) => onChange(Number(text))}
                            />
                        )}
                    />

                    {/* Buttons */}
                    <Pressable className="bg-blue-500 p-3 rounded mb-2" onPress={handleSubmit(handleFormSubmit)}>
                        <Text className="text-white text-center font-bold">Add Event</Text>
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
