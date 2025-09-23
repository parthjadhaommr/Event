import React, { useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Controller, UseFormReturn, FieldValues } from "react-hook-form";

interface VenueModalProps {
    visible: boolean;
    onClose: () => void;
    form: UseFormReturn<FieldValues>;
    editVenueId?: string; // optional, pass if editing
    onSuccess?: () => void; // optional callback after successful add/update
}

const BASE_URL = "http://localhost:5000"; // backend URL

const VenueModal: React.FC<VenueModalProps> = ({ visible, onClose, form, editVenueId, onSuccess }) => {
    const { control, handleSubmit, reset } = form;

    // Submit handler
    const handleFormSubmit = async (data: any) => {
        try {
            const url = editVenueId ? `${BASE_URL}/updateVenues/${editVenueId}` : `${BASE_URL}/addVenue`;
            const method = editVenueId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Something went wrong");

            Alert.alert("Success", editVenueId ? "Venue updated" : "Venue added");
            reset();        // reset form
            onClose();      // close modal
            onSuccess && onSuccess(); // optional callback
        } catch (err: any) {
            Alert.alert("Error", err.message || "Failed to submit");
        }
    };

    // Reset form on modal close
    useEffect(() => {
        if (!visible) reset();
    }, [visible]);

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="w-11/12 max-h-4/5 bg-white rounded-xl p-5">
                    <Text className="text-center text-xl font-semibold mb-4">
                        {editVenueId ? "Edit Venue" : "Add Venue"}
                    </Text>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Name */}
                        <Controller
                            control={control}
                            name="name"
                            rules={{ required: "Venue name is required" }}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <>
                                    <TextInput
                                        className="border border-gray-300 rounded-lg p-3 mb-1"
                                        placeholder="Venue Name"
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                    {error && <Text className="text-red-500 mb-2">{error.message}</Text>}
                                </>
                            )}
                        />

                        {/* Address */}
                        <Controller
                            control={control}
                            name="address"
                            rules={{ required: "Address is required" }}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <>
                                    <TextInput
                                        className="border border-gray-300 rounded-lg p-3 mb-1"
                                        placeholder="Address"
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                    {error && <Text className="text-red-500 mb-2">{error.message}</Text>}
                                </>
                            )}
                        />

                        {/* Capacity */}
                        <Controller
                            control={control}
                            name="capacity"
                            rules={{
                                required: "Capacity is required",
                                validate: (val) => !isNaN(Number(val)) || "Capacity must be a number",
                            }}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <>
                                    <TextInput
                                        className="border border-gray-300 rounded-lg p-3 mb-1"
                                        placeholder="Capacity"
                                        keyboardType="numeric"
                                        value={value?.toString() ?? ""}
                                        onChangeText={onChange}
                                    />
                                    {error && <Text className="text-red-500 mb-2">{error.message}</Text>}
                                </>
                            )}
                        />
                    </ScrollView>

                    <View className="flex-row justify-end mt-4">
                        <TouchableOpacity
                            className="bg-gray-300 px-4 py-2 rounded-lg mr-2"
                            onPress={onClose}
                        >
                            <Text className="text-black font-semibold">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-blue-500 px-4 py-2 rounded-lg"
                            onPress={handleSubmit(handleFormSubmit)}
                        >
                            <Text className="text-white font-semibold">Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default VenueModal;
