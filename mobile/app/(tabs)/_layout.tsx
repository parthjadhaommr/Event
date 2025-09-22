import React from 'react'
import { Feather } from "@expo/vector-icons";
import { Redirect, Tabs } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@clerk/clerk-expo';
// import { View } from 'react-native-reanimated/lib/typescript/Animated';
import { TouchableOpacity, View } from 'react-native';

const TabsLayout = () => {
    const insets = useSafeAreaInsets();
    const { isSignedIn } = useAuth();
    if (!isSignedIn) return <Redirect href="./(auth)" />

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#1DA1F2",
                tabBarInactiveTintColor: "#657786",
                tabBarStyle: {
                    backgroundColor: "#fff",
                    borderTopWidth: 1,
                    borderTopColor: "#E1E8ED",
                    height: 60 + insets.bottom,
                    paddingTop: 8
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="home" size={size} color={color} />
                    ),
                    headerRight: () => (
                        <View className="flex-row mr-3">
                            {/* Add Button */}
                            <TouchableOpacity
                                className="mx-2"
                                onPress={() => console.log("Add pressed")}
                            >
                                <Feather name="plus" size={22} color="#1DA1F2" />
                            </TouchableOpacity>

                            {/* Exit Button */}
                            <TouchableOpacity
                                className="mx-2"
                            // onPress={ }
                            >
                                <Feather name="log-out" size={22} color="red" />
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name='venue'
                options={{
                    title: "Venue",
                    tabBarIcon: ({ color, size }) => <Feather name="map-pin"
                        size={size} color={color}
                    />

                }}
            />
        </Tabs >
    )
}

export default TabsLayout
