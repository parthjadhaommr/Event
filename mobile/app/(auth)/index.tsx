import { useSocialAuth } from "@/hooks/useSocialAuth";
import { Image, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";


export default function Index() {
    const { handleSocialAuth, isLoading } = useSocialAuth()

    return (
        <View className="flex-1 bg-white">
            <View className="flex-1 px-8 justify-center">
                <View className="flex-1 justify-center">
                    <View className="items-center">
                        <Image
                            source={require("../../assets/images/party.png")}
                            className="size-96"
                            resizeMode="contain"
                        />
                    </View>
                    <View className="flex-col gap-2">
                        <TouchableOpacity className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full py-3 px-6"
                            onPress={() => { handleSocialAuth("oauth_google") }}
                            disabled={isLoading}
                            style={{
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.1,
                                shadowRadius: 2,
                                elevation: 2
                            }}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#000" />
                            ) : (
                                <View className="flex-row items-center justify-center">
                                    <Image
                                        source={require("../../assets/images/google.png")}
                                        className="size-10 "
                                        resizeMode="contain"
                                    />
                                    <Text className="text-black font-medium text-base">Continue with Google</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full py-3 px-6"
                            onPress={() => { handleSocialAuth("oauth_apple") }}
                            disabled={isLoading}
                            style={{
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.1,
                                shadowRadius: 2,
                                elevation: 2
                            }}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#000" />
                            ) : (
                                <View className="flex-row items-center justify-center">
                                    <Image
                                        source={require("../../assets/images/apple.png")}
                                        className="size-10 "
                                        resizeMode="contain"
                                    />
                                    <Text className="text-black font-medium text-base">Continue with Apple</Text>
                                </View>
                            )}

                        </TouchableOpacity>
                    </View>
                </View>
            </View >
        </View >

    );
}

// TODO : TouchableOpacity