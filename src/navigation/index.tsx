// import { NavigationContainer } from "@react-navigation/native";
// import {
//   createNativeStackNavigator,
//   NativeStackNavigationOptions,
// } from "@react-navigation/native-stack";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useEffect, useState } from "react";
// import { Image, View, Text } from "react-native";

// import HomeScreen from "../screens/HomeScreen";
// import DetailsScreen from "../screens/DetailsScreen";
// import PlayerScreen from "../screens/PlayerScreen";
// import ProfileScreen from "../screens/ProfileScreen";
// import SettingsScreen from "../screens/SettingsScreen";
// import LiveScreen from "../screens/LiveScreen";
// import StatsScreen from "../screens/StatsScreen";
// import { useAppContext } from "../context/AppContext";

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// function HomeStack() {
//   const { theme } = useAppContext();

//   const screenOptions: NativeStackNavigationOptions = {
//     headerStyle: {
//       backgroundColor: theme.card,
//     },
//     headerTintColor: theme.text,
//     headerTitle: "",
//     contentStyle: {
//       backgroundColor: theme.bg,
//     },
//     headerLeft: () => (
//       <View
//         style={{
//           flexDirection: "row",
//           alignItems: "center",
//           marginLeft: 8,
//         }}
//       >
//         <Image
//           source={require("../../assets/logo.png")}
//           style={{
//             width: 36,
//             height: 36,
//             resizeMode: "contain",
//           }}
//         />

//         <Text
//           style={{
//             color: theme.text,
//             fontSize: 18,
//             fontWeight: "600",
//             marginLeft: 10,
//           }}
//         >
//           ZenFlow
//         </Text>
//       </View>
//     ),
//   };

//   return (
//     <Stack.Navigator screenOptions={screenOptions}>
//       <Stack.Screen name="Meditations" component={HomeScreen} />
//       <Stack.Screen name="Details" component={DetailsScreen} />
//       <Stack.Screen name="Player" component={PlayerScreen} />
//     </Stack.Navigator>
//   );
// }

// export default function AppNavigator() {
//   const { theme } = useAppContext();
//   const [initialState, setInitialState] = useState<any>();
//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     const restoreState = async () => {
//       try {
//         const savedState = await AsyncStorage.getItem("NAVIGATION_STATE");

//         if (savedState) {
//           setInitialState(JSON.parse(savedState));
//         }
//       } catch (e) {
//         console.log("Nav load error", e);
//       } finally {
//         setIsReady(true);
//       }
//     };

//     void restoreState();
//   }, []);

//   if (!isReady) return null;

//   return (
//     <NavigationContainer
//       initialState={initialState}
//       onStateChange={(state) => {
//         AsyncStorage.setItem("NAVIGATION_STATE", JSON.stringify(state));
//       }}
//     >
//       <Tab.Navigator
//         screenOptions={{
//           headerShown: false,
//           tabBarStyle: {
//             backgroundColor: theme.card,
//             borderTopColor: theme.bg,
//           },
//           tabBarActiveTintColor: theme.accent,
//           tabBarInactiveTintColor: theme.sub,
//           sceneStyle: {
//             backgroundColor: theme.bg,
//           },
//         }}
//       >
//         <Tab.Screen name="Home" component={HomeStack} />
//         <Tab.Screen name="Live" component={LiveScreen} />
//         <Tab.Screen name="Stats" component={StatsScreen} />
//         <Tab.Screen name="Profile" component={ProfileScreen} />
//         <Tab.Screen name="Settings" component={SettingsScreen} />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }




import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Image, View, Text } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import DetailsScreen from "../screens/DetailsScreen";
import PlayerScreen from "../screens/PlayerScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import LiveScreen from "../screens/LiveScreen";
import StatsScreen from "../screens/StatsScreen";
import SecurityScreen from "../screens/SecurityScreen";
import { useAppContext } from "../context/AppContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  const { theme } = useAppContext();

  const screenOptions: NativeStackNavigationOptions = {
    headerStyle: {
      backgroundColor: theme.card,
    },
    headerTintColor: theme.text,
    headerTitle: "",
    contentStyle: {
      backgroundColor: theme.bg,
    },
    headerLeft: () => (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginLeft: 8,
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
            color: theme.text,
            fontSize: 18,
            fontWeight: "600",
            marginLeft: 10,
          }}
        >
          ZenFlow
        </Text>
      </View>
    ),
  };

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Meditations" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="Player" component={PlayerScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { theme } = useAppContext();
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

    void restoreState();
  }, []);

  if (!isReady) return null;

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={(state) => {
        AsyncStorage.setItem("NAVIGATION_STATE", JSON.stringify(state));
      }}
    >
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.card,
            borderTopColor: theme.bg,
          },
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.sub,
          sceneStyle: {
            backgroundColor: theme.bg,
          },
        }}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Live" component={LiveScreen} />
        <Tab.Screen name="Stats" component={StatsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Security" component={SecurityScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
