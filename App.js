import { createDrawerNavigator } from "@react-navigation/drawer";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import HomeScreen from "./screens/Home";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ModalComponent from "./components/ModalComponent";

import BookingDetailContextProvider from "./context/BookingDetailContextProvider";
import NotifcationContextProvider from "./context/NotifcationContextProvider";
import BookingHistoryScreen from "./screens/BookingHistoryScreen";
import { useEffect, useState } from "react";
import { init } from "./util/database";
import Notification from "./components/Notification";
import MapScreen from "./screens/MapScreen";

const Drawer = createDrawerNavigator();
const BottomTab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BookingStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BookingHistory"
        component={BookingHistoryScreen}
        options={{ headerTitle: "Booking History", headerShown: false }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{ headerTitle: "Map View", headerShown: false }}
      />
    </Stack.Navigator>
  );
}
function BottomTabNavigator() {
  return (
    <BottomTab.Navigator>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-sharp" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
    </BottomTab.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <>
      <StatusBar backgroundColor="#CD1A21" style="light" />
      <Drawer.Navigator>
        <Drawer.Screen
          name="HomeScreen"
          component={BottomTabNavigator}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),

            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="Booking History"
          component={BookingStackNavigator}
          options={{
            drawerIcon: ({ color, size }) => (
              <FontAwesome name="history" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
      </Drawer.Navigator>
    </>
  );
}
export default function App() {
  const [dbinitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    init()
      .then(() => {
        setDbInitialized(true);
      })
      .catch((error) => {
        console.log("Error initializing database: ", error);
      });
  }, []);

  if (!dbinitialized) {
    // show app loading screen
  }

  return (
    <BookingDetailContextProvider>
      <NotifcationContextProvider>
        <NavigationContainer>
          <ModalComponent />
          <Notification/>
          <DrawerNavigator />
        </NavigationContainer>
      </NotifcationContextProvider>
    </BookingDetailContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
