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
import { useContext, useEffect, useState } from "react";
import { init } from "./util/database";
import Notification from "./components/Notification";
import MapScreen from "./screens/MapScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import AuthContextProvider, { AuthContext } from "./context/AuthContext";
import * as SplashScreen from "expo-splash-screen";
import DriverLocation from "./screens/DriverLocation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import notificationContext from "./context/NotificationContext";

const Drawer = createDrawerNavigator();
const BottomTab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BookingStackNavigator() {
  return (
    <>
    <StatusBar backgroundColor="#CD1A21" style="light" />
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

    </>
  );
}
function BottomTabNavigator() {
  return (
    <>
    <StatusBar backgroundColor="#CD1A21" style="light" />
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
    </>
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
        <Drawer.Screen
          name="Driver Location"
          component={DriverLocation}
          options={{
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="my-location" size={24} color="black" />
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
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    // submitDriverId();
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



  function AuthStack() {
    return (
      <>
      <StatusBar backgroundColor="#CD1A21" style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#CD1A21" },
          headerTintColor: "white",
          contentStyle: { backgroundColor: "#f4f4f4" },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>

      </>
    );
  }

  SplashScreen.preventAutoHideAsync();
  function RootNavigator() {
    const authCtx = useContext(AuthContext);

    useEffect(() => {
      async function loadToken() {
        try {
          // Simulate checking token
          const storedToken = await AsyncStorage.getItem("token");
          if (storedToken) {
            authCtx.authenticate(storedToken);
          }
        } catch (e) {
          console.warn(e);
        } finally {
          // Tell the app to hide the splash screen after token check
          setAppIsReady(true);
        }
      }

      loadToken();
    }, []);

    useEffect(() => {
      if (appIsReady) {
        // Hide the splash screen once the app is ready
        SplashScreen.hideAsync();
      }
    }, [appIsReady]);

    if (!appIsReady) {
      return null; // Return nothing while the splash screen is visible
    }

    return (
      <NavigationContainer>
        {!authCtx.isAuthenticated && <AuthStack />}
        {authCtx.isAuthenticated && (
          <>
            <ModalComponent />
            <Notification />
            <DrawerNavigator />
          </>
        )}
      </NavigationContainer>
    );
  }

  return (
    <AuthContextProvider>
      <BookingDetailContextProvider>
        <NotifcationContextProvider>
          <RootNavigator />
        </NotifcationContextProvider>
      </BookingDetailContextProvider>
    </AuthContextProvider>
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
