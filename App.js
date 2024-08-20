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
import { useFonts } from "expo-font";
import CustomDrawerContent from "./components/CustomDrawer";
import EarningsScreen from "./screens/Earnings";
import IconButton from "./components/ui/IconButton";

const Drawer = createDrawerNavigator();
const BottomTab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

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
      <BottomTab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#CD1A21" },
          headerTintColor: "black",
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "white",
          tabBarLabelStyle: { fontSize: 15 },
          tabBarStyle: {
            backgroundColor: "#CD1A21",
            height: 60,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            overflow: "hidden",
          },
        }}
      >
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
  const authCtx = useContext(AuthContext);
  return (
    <>
      <StatusBar backgroundColor="#CD1A21" style="light" />
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerActiveTintColor: "#CD1A21",
          drawerInactiveTintColor: "black",
          headerStyle: { backgroundColor: "#CD1A21" },
          headerTitleStyle: {
            color: "white",
            fontFamily: "Roboto-Bold",
          },
        }}
      >
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

            headerRight: ({ tintColor }) => (
              <IconButton
                icon="exit"
                color={"white"}
                size={24}
                onPress={() => {
                  authCtx.logout();
                }}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Earnings"
          component={EarningsScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="my-location" size={24} color="black" />
            ),
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

  function RootNavigator() {
    const authCtx = useContext(AuthContext);
    const [loaded, error] = useFonts({
      "Roboto-Regular": require("./assets/Fonts/Roboto/Roboto-Regular.ttf"),
      "Roboto-Bold": require("./assets/Fonts/Roboto/Roboto-Bold.ttf"),
    });

    useEffect(() => {
      async function loadToken() {
        try {
          const storedToken = await AsyncStorage.getItem("token");
          if (storedToken) {
            authCtx.authenticate(storedToken);
          }
        } catch (e) {
          console.warn(e);
        } finally {
          // Tell the app to hide the splash screen after token check and fonts are loaded
          setAppIsReady(true);
        }
      }

      loadToken();
    }, []);

    useEffect(() => {
      if (appIsReady && (loaded || error)) {
        SplashScreen.hideAsync();
      }
    }, [appIsReady, loaded, error]);

    if (!appIsReady || (!loaded && !error)) {
      return null; // Return nothing while the splash screen is visible and fonts are loading
    }

    return (
      <NavigationContainer>
        {!authCtx.isAuthenticated && (
          <>
            
            <AuthStack />
          </>
        )}
        {authCtx.isAuthenticated && (
          <>
            <Notification />
            <ModalComponent />
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
