import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Controller, UseFormReturn, FieldValues } from "react-hook-form";

interface VenueModalProps {
    visible: boolean;
    onClose: () => void;
    form: UseFormReturn<FieldValues>;
    onSubmit: (data: any) => void;
}

const VenueModal: React.FC<VenueModalProps> = ({ visible, onClose, form, onSubmit }) => {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="w-11/12 max-h-4/5 bg-white rounded-xl p-5">
                    <Text className="text-center text-xl font-semibold mb-4">Add / Edit Venue</Text>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Name */}
                        <Controller
                            control={form.control}
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
                            control={form.control}
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
                            control={form.control}
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
                            onPress={form.handleSubmit(onSubmit)}
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
