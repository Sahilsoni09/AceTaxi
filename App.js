import { createDrawerNavigator } from "@react-navigation/drawer";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  FontAwesome,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5
} from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ModalComponent from "./components/ModalComponent";
import BookingDetailContextProvider from "./context/BookingDetailContextProvider";
import NotifcationContextProvider from "./context/NotifcationContextProvider";
import { useContext, useEffect, useState } from "react";
import { init } from "./util/database";
import Notification from "./components/Notification";
import AuthContextProvider, { AuthContext } from "./context/AuthContext";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import CustomDrawerContent from "./components/CustomDrawer";
import IconButton from "./components/ui/IconButton";
import { LogContextProvider } from "./context/LogContext";
import * as Sentry from "@sentry/react-native";
import { ThemeContextProvider, useTheme } from "./context/ThemeContext";
import {
  HomeScreen,
  BookingHistoryScreen,
  MapScreen,
  LoginScreen,
  SignupScreen,
  DriverLocationScreen,
  BackgroundLocationScreen,
  LogScreen,
  EarningsScreen,
  ActiveRide,
} from "./screens";

Sentry.init({
  dsn: "https://d8e473d6b6b9cde2cdb43a744e9d310f@o4507848991375360.ingest.us.sentry.io/4507853493960704",

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // enableSpotlight: __DEV__,
});

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
          headerTitleStyle: {
            color: "white",
            fontFamily: "Roboto-Bold",
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
        <BottomTab.Screen
          name="Active Ride"
          component={ActiveRide}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="car" size={size} color={color} />
            ),
          }}
        />
        <BottomTab.Screen
          name="Logs"
          component={LogScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="console" size={24} color="white" />
            ),
          }}
        />
      </BottomTab.Navigator>
    </>
  );
}

function DrawerNavigator() {
  const { theme } = useTheme();
  const authCtx = useContext(AuthContext);
  return (
    <>
      <StatusBar backgroundColor="#CD1A21" style="light" />
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerActiveTintColor: "#CD1A21",
          drawerInactiveTintColor: theme === "dark" ? "white" : "black",
          headerStyle: { backgroundColor: "#CD1A21" },
          headerTitleStyle: {
            color: "white",
            fontFamily: "Roboto-Bold",
          },
          drawerStyle: {
            backgroundColor: theme === "dark" ? "black" : "white",
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
        {/* <Drawer.Screen
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
        /> */}
        <Drawer.Screen
          name="Driver Location"
          component={BackgroundLocationScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="my-location" size={size} color={color} />
            ),

            headerRight: ({ tintColor }) => (
              <IconButton
                icon="exit"
                color={"white"}
                size={24}
                onPress={() => {
                  console.log("logout triggere");
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
              <Ionicons name="card" color={color} size={size} />
            ),
          }}
        />
      </Drawer.Navigator>
    </>
  );
}
function App() {
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
    <ThemeContextProvider>
      <LogContextProvider>
        <AuthContextProvider>
          <BookingDetailContextProvider>
            <NotifcationContextProvider>
              <RootNavigator />
            </NotifcationContextProvider>
          </BookingDetailContextProvider>
        </AuthContextProvider>
      </LogContextProvider>
    </ThemeContextProvider>
  );
}

export default Sentry.wrap(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
