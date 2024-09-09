import React, { useState, useEffect, useContext, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import LogContext from "../context/LogContext";
import * as Sentry from "@sentry/react-native";
import BookingDetailContext from "../context/BookingDetailContext";
import OnlineStatusIndicator from "./OnlineStatusIndicator";
import { useTheme } from "../context/ThemeContext";
import { useSelector } from "react-redux";

const LOCATION_TASK_NAME = "background-location-task";

let token;
const BackgroundLocationTracker = () => {
  const [locationStarted, setLocationStarted] = useState(false);
  const [locationData, setLocationData] = useState(null); // State to store location data
  const [lastSentTime, setLastSentTime] = useState(null); // State to store last sent time
  const [apiStatus, setApiStatus] = useState(""); // State to store API status
  const [permission, setPermission] = useState(false);

  const { authData } = useContext(AuthContext);
  const fullName = authData?.fullName;
  const authCtx = useContext(AuthContext);
  token = authCtx.tokenRef;
  const driverId = authCtx.authData.userId;
  
  //  Use Redux to get authentication data
  //  const { authData, token: authToken } = useSelector((state) => state.auth);
  //  const fullName = authData?.fullName;
  //  token = authToken; // Update token from Redux state
  //  const driverId = authData?.userId;

  const { theme } = useTheme();

  const { addLog } = useContext(LogContext);

  const { isPermissionGranted, setIsPermissionGranted } =
    useContext(BookingDetailContext);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();
      const { status: backgroundStatus } =
        await Location.requestBackgroundPermissionsAsync();

      if (foregroundStatus !== "granted" || backgroundStatus !== "granted") {
        console.log("Permission to access location was denied");
        addLog("Permission to access location was denied");
        Sentry.captureException(
          new Error("Permission to access location was denied", "error")
        );
      } else {
        setIsPermissionGranted(true);
        console.log("Permission to access location granted");
        addLog("Permission to access location granted");
        Sentry.captureMessage(`Log: Location Permission granted`, "log");

        setPermission(true);
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    if (!permission) return;
    console.log("Starting location tracking...");
    startLocationTracking();
  }, [permission]);

  TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
      console.error("Background location task error:", error);
      addLog(`Background location task error: ${error.message}`);
      Sentry.captureException(
        new Error(`Background location task error: ${error.message}`)
      );

      return;
    }
    if (data) {
      const { locations } = data;
      const location = locations[0];
      if (location) {
        const { longitude, latitude, heading, speed } = location.coords;
        const driverSpeed = +speed.toFixed(2);
        const newLocationData = {
          userId: driverId,
          longtitude: longitude,
          latitude: latitude,
          heading: 0,
          speed: driverSpeed,
        };

        setLocationData(newLocationData);

        console.log("Background location:", newLocationData);
        addLog(`Location: ${JSON.stringify(newLocationData)}`);
        Sentry.captureMessage(
          `Location: ${JSON.stringify(newLocationData)}`,
          "log"
        );

        if (token.current) {
          await sendLocationToApi(newLocationData);

          // await sendLocationToApi({
          //   coords: newLocationData,
          //   token: token.current,
          //   setLastSentTime,
          //   setApiStatus,
          //   addLog,
          // });
        }
        
      }
    }
  });

  const sendLocationToApi = async (coords) => {
    const BASE = "https://api.acetaxisdorset.co.uk";
    const url = `${BASE}/api/UserProfile/UpdateGPS`;

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.current}`,
      };

      const response = await axios.post(url, coords, { headers });

      // Update the last sent time and API status based on the actual response
      const currentTime = new Date().toLocaleTimeString();
      setLastSentTime(currentTime);

      if (response.status === 200) {
        setApiStatus(`Success`); // Set API status to Success
      } else {
        setApiStatus(`Failed: ${response.status} ${response.statusText}`);
      }

      console.log("Location sent to API at", currentTime);
      addLog(`Location sent to API at ${currentTime}`);
      Sentry.captureMessage(
        `Log: Location sent to API at: ${currentTime}`,
        "log"
      );
    } catch (error) {
      setApiStatus(`Failed: ${error.message}`);
      console.error("Error sending location to API:", error);
      addLog(`Error sending location to API: ${error.message}`);
      Sentry.captureException(
        new Error(`Error sending location to API: ${error.message}`)
      );
    }
  };

  const startLocationTracking = async () => {
    // const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
 
    // if(!isTaskRegistered){
    const { status } = await Location.requestBackgroundPermissionsAsync();

    if (status === "granted") {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 500,
        distanceInterval: 0,
        pausesUpdatesAutomatically: false,
        foregroundService: {
          notificationTitle: "Ace Taxi",
          notificationBody: "App is Active",
        },
      });
      setLocationStarted(true);
      console.log("Background location tracking started");
      Sentry.captureMessage(`Log: Background location tracking started`, "log");
    } else {
      console.error("Background location permission not granted");
      addLog("Background location permission not granted");
      Sentry.captureException(
        new Error("Background location permission not granted")
      );
    }
    // else{
    //   console.log("Background location tracking is already running");
    // }

  };

  const stopLocationTracking = async () => {
    console.log("Background location tracking stopped");
    setLocationStarted(false);
    TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME)
      .then((tracking) => {
        console.log("Is task registered?", tracking);
        if (tracking) {
          Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
          console.log("Location tracking stopped.");
          Sentry.captureMessage(`Log: Location tracking stopped`, "log");
        }
      })
      .catch((error) => {
        console.error("Error stopping location tracking:", error);
        Sentry.captureException(
          new Error(`Error stopping location tracking: ${error}`)
        );
      });
  };

  return (
    <View
      style={styles.container}
      className={`${theme === "dark" ? "bg-black" : "bg-white"}`}
    >
      <OnlineStatusIndicator />

      <Text style={styles.welcomeText}>Welcome, {fullName}!</Text>

      {/* {locationStarted ? (
        <TouchableOpacity onPress={stopLocationTracking}>
          <Text style={styles.btnText}>Stop Tracking</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={startLocationTracking}>
          <Text style={styles.btnText}>Start Tracking</Text>
        </TouchableOpacity>
      )} */}

      {/* Display the location data */}
      {locationData ? (
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>
            Longitude: {locationData.longtitude}
          </Text>
          <Text style={styles.locationText}>
            Latitude: {locationData.latitude}
          </Text>
          <Text style={styles.locationText}>
            Heading: {locationData.heading}
          </Text>
          <Text style={styles.locationText}>Speed: {locationData.speed}</Text>
        </View>
      ) : (
        <Text>Fetching Location....</Text>
      )}

      {/* Display the last sent time */}
      {lastSentTime && (
        <Text style={styles.sentTimeText}>Last Sent Time: {lastSentTime}</Text>
      )}

      {/* Display the API status */}
      {apiStatus && (
        <Text
          style={[
            styles.apiStatusText,
            { color: apiStatus.includes("Success") ? "green" : "red" },
          ]}
        >
          API Status: {apiStatus}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "white",
    width: "100%",
  },
  btnText: {
    fontSize: 20,
    backgroundColor: "green",
    color: "white",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  locationContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
  },
  locationText: {
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    color: "#333",
    marginBottom: 5,
  },
  sentTimeText: {
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    color: "blue",
    marginTop: 20,
  },
  apiStatusText: {
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: "Roboto-Bold",
    color: "#333",
  },
});

export default BackgroundLocationTracker;
