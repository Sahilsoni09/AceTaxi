import React, { useState, useEffect, useContext, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { AppState } from "react-native";

const LOCATION_TASK_NAME = "background-location-task";

let token;
const BackgroundLocationTracker = () => {
  const [locationStarted, setLocationStarted] = useState(false);
  const [locationData, setLocationData] = useState(null); // State to store location data
  const [lastSentTime, setLastSentTime] = useState(null); // State to store last sent time
  const [apiStatus, setApiStatus] = useState(""); // State to store API status
  
  const [permission, setPermission] = useState(false);

  const authCtx = useContext(AuthContext);
  token = authCtx.tokenRef;


  
  useEffect(() => {
    const requestPermissions = async () => {
      const { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();
      const { status: backgroundStatus } =
        await Location.requestBackgroundPermissionsAsync();

      if (foregroundStatus !== "granted" || backgroundStatus !== "granted") {
        console.log("Permission to access location was denied");
      } else {
        console.log("Permission to access location granted");
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



  // // Stop location tracking when the user logs out
  // useEffect(() => {
  //   if (!token && locationStarted) {
  //     console.log("Token is null, stopping location tracking...");
  //     stopLocationTracking();
  //   }
  // }, [token]);

  // AppState.addEventListener("change", (nextAppState) => {
  //   if (nextAppState === "background") {
  //     startLocationTracking();
  //     console.log("AppState is background and location tracking started");
  //   }
  // });

  // Task Manager for background location tracking
  TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
      console.error("Background location task error:", error);
      return;
    }
    if (data) {
      const { locations } = data;
      const location = locations[0];
      if (location) {
        const { longitude, latitude, heading, speed } = location.coords;
        const driverSpeed = +speed.toFixed(2);
        const newLocationData = {
          userId: 8, // Replace with your dynamic userId
          longtitude: longitude,
          latitude: latitude,
          heading: 0,
          speed: driverSpeed,
        };

        // Update the state with the new location data
        setLocationData(newLocationData);

        console.log("Background location:", newLocationData);

        // Send the location to your API
        if(token.current)
        await sendLocationToApi(newLocationData);
      }
    }
  });

  // Function to send location data to the API
  const sendLocationToApi = async (coords) => {
    const BASE = "https://api.acetaxisdorset.co.uk";
    const url = `${BASE}/api/UserProfile/UpdateGPS`;

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.current}`,// Use the token from context
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

      console.log("Location sent to API from background at", currentTime);
      // console.log("token", token.current);
    } catch (error) {
      // Handle network errors or other unexpected errors
      setApiStatus(`Failed: ${error.message}`);
      console.error("Error sending location to API:", error);
    }
  };

  const startLocationTracking = async () => {
    const { status } = await Location.requestBackgroundPermissionsAsync();

    if (status === "granted") {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 500,
        distanceInterval: 0,
        pausesUpdatesAutomatically: false,
      });
      setLocationStarted(true);
      console.log("Background location tracking started");
    } else {
      console.error("Background location permission not granted");
    }
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
        }
      })
      .catch((error) => {
        console.error("Error stopping location tracking:", error);
      });
  };

  return (
    <View style={styles.container}>
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
    backgroundColor: "white",
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
    color: "#333",
    marginBottom: 5,
  },
  sentTimeText: {
    fontSize: 16,
    color: "blue",
    marginTop: 20,
  },
  apiStatusText: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default BackgroundLocationTracker;
