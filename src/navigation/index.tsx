import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import HomeScreen from "../screens/HomeScreen";
import DetailsScreen from "../screens/DetailsScreen";
import PlayerScreen from "../screens/PlayerScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";

import { Image, View, Text } from "react-native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#020617" },
        headerTintColor: "#fff",
        headerTitle: "",

        headerLeft: () => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 15,
            }}
          >
            <Image
              source={require("../../assets/logo.png")}
              style={{
                width: 36,
                height: 36,
                resizeMode: "contain",
              }}
            />

            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: "600",
                marginLeft: 10,
              }}
            >
              ZenFlow
            </Text>
          </View>
        ),
      }}
    >
      <Stack.Screen name="Meditations" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="Player" component={PlayerScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const [initialState, setInitialState] = useState<any>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedState = await AsyncStorage.getItem("NAVIGATION_STATE");

        if (savedState) {
          setInitialState(JSON.parse(savedState));
        }
      } catch (e) {
        console.log("Nav load error", e);
      } finally {
        setIsReady(true);
      }
    };

    restoreState();
  }, []);

  if (!isReady) return null;

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={(state) => {
        AsyncStorage.setItem(
          "NAVIGATION_STATE",
          JSON.stringify(state)
        );
      }}
    >
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: "#020617" },
          tabBarActiveTintColor: "#22c55e",
          tabBarInactiveTintColor: "#94a3b8",
        }}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
