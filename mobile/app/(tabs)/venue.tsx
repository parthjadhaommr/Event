import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons';

interface Venue {
    id: string;
    name: string;
    address: string;
    capacity: number;
}

// Dummy venues
const dummyVenues: Venue[] = [
    { id: 'v1', name: 'Grand Hall', address: '123 Main St', capacity: 500 },
    { id: 'v2', name: 'Open Arena', address: '456 Park Ave', capacity: 1000 },
    { id: 'v3', name: 'Sports Complex', address: '789 Stadium Rd', capacity: 300 },
    { id: 'v4', name: 'Conference Center', address: '101 Business Blvd', capacity: 200 },
    { id: 'v5', name: 'Music Dome', address: '202 Concert Lane', capacity: 700 },
    { id: 'v6', name: 'Expo Grounds', address: '303 Exhibition Way', capacity: 1500 },
    { id: 'v7', name: 'Community Hall', address: '404 Local St', capacity: 150 },
    { id: 'v8', name: 'Sky Theater', address: '505 Downtown Ave', capacity: 400 },
];

const VenueTab = () => {
    const [venues, setVenues] = useState<Venue[]>(dummyVenues);

    const handleDelete = (id: string) => {
        Alert.alert('Delete Venue', 'Are you sure you want to delete this venue?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => setVenues(venues.filter((v) => v.id !== id)),
            },
        ]);
    };

    const handleEdit = (id: string) => {
        Alert.alert('Edit Venue', `You can edit venue with id: ${id}`);
        // Here you can open your Venue Modal in "edit" mode
    };

    return (
        <ScrollView className="p-4 bg-gray-100 flex-1">
            {venues.map((venue) => (
                <View
                    key={venue.id}
                    className="bg-white p-4 rounded mb-4 shadow-md flex-row justify-between items-center"
                >
                    <View className="flex-1">
                        <Text className="text-lg font-bold">{venue.name}</Text>
                        <Text className="text-gray-500">{venue.address}</Text>
                        <Text className="text-gray-500">Capacity: {venue.capacity}</Text>
                    </View>

                    <View className="flex-row ml-2">
                        <Pressable
                            className="mr-2 bg-yellow-500 p-2 rounded"
                            onPress={() => handleEdit(venue.id)}
                        >
                            <Feather name="edit" size={20} color="white" />
                        </Pressable>
                        <Pressable
                            className="bg-red-500 p-2 rounded"
                            onPress={() => handleDelete(venue.id)}
                        >
                            <Feather name="trash-2" size={20} color="white" />
                        </Pressable>
                    </View>
                </View>
            ))}

            {venues.length === 0 && (
                <Text className="text-center text-gray-500 mt-10">No venues available.</Text>
            )}
        </ScrollView>
    );
};

export default VenueTab;
