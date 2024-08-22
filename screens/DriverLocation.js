// DriverLocation.js
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import OnlineStatusIndicator from '../components/OnlineStatusIndicator';
import { AuthContext } from '../context/AuthContext';
import { startBackgroundUpdate, stopBackgroundUpdate } from '../components/BackgroundLocationTask';



const DriverLocation = () => {
  const [location, setLocation] = useState(null); // State to store location data
  const [errorMsg, setErrorMsg] = useState(null); // State to store error messages
  const [isOnline, setIsOnline] = useState(true); // State to store online status
  const userId = 8;
  const authCtx = useContext(AuthContext); // Get authentication context
  const token = authCtx.token; // Get token from authentication context

  useEffect(() => {
    const getLocationUpdates = async () => {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Watch the device's location continuously with specified settings
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 0,
        },
        (newLocation) => {
          const { longitude, latitude, heading, speed } = newLocation.coords;
          const locationData = {
            userId: userId,
            longtitude: longitude,
            latitude: latitude,
            heading: heading,
            speed: speed,
          };
          setLocation(locationData); // Update location state
          if (isOnline) {
            sendLocationToApi(locationData); // Send location to API if online
          }
        }
      );
    };

    
    getLocationUpdates();

    if (isOnline) {
      startBackgroundUpdate(); 
    } else {
      stopBackgroundUpdate(); 
    }

    return () => {
      stopBackgroundUpdate(); 
    };

  }, [isOnline]); // Re-run effect if online status changes

  // Function to send location data to the API
  const sendLocationToApi = async (coords) => {

    console.log(coords)
    const BASE = 'https://api.acetaxisdorset.co.uk';
    const url = `${BASE}/api/UserProfile/UpdateGPS`;

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };
 
      await axios.post(url, coords, { headers }); // Send POST request to the API with location data
      console.log('Location sent to API');
    } catch (error) {
      console.error('Error sending location to API:', error);
      // Alert.alert(
      //   'Internet Connection',
      //   'You are offline. Some features may not be available.'
      // );
    }
  };

  let displayContent;
  if (errorMsg) {
    displayContent = <Text>{errorMsg}</Text>; // Display error message if permission is denied
  } else if (location) {
    displayContent = (
      <View >
        <Text style ={{fontFamily: 'Roboto-Regular'}}>Longitude: {location.longtitude}</Text>
        <Text style ={{fontFamily: 'Roboto-Regular'}}>Latitude: {location.latitude}</Text>
        <Text style ={{fontFamily: 'Roboto-Regular'}}>Heading: {location.heading}</Text>
        <Text style ={{fontFamily: 'Roboto-Regular'}}>Speed: {location.speed}</Text>
      </View>
    );
  } else {
    displayContent = <Text>Fetching location...</Text>; // Display loading message while fetching location
  }

  return (
    <View style={styles.container}>
      {/* Include OnlineStatusIndicator component and pass setIsOnline to update online status */}
      <OnlineStatusIndicator setIsOnline={setIsOnline} />
      {displayContent}
    </View>
  );
};

export default DriverLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
