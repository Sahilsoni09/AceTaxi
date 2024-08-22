// BackgroundLocationTask.js
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import axios from 'axios'; // Import axios if it's used in sending data to the API

// Define the task name
const LOCATION_TASK_NAME = 'background-location-task';

// Define the task that will run in the background
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Background location task error:', error);
    return;
  }
  if (data) {
    const { locations } = data;
    const location = locations[0];
    if (location) {
      const { longitude, latitude, heading, speed } = location.coords;
      const locationData = {
        userId: 8, // Replace with your dynamic userId
        longtitude: longitude,
        latitude: latitude,
        heading: heading,
        speed: speed,
      };
      console.log('Background location:', locationData);

      // Send the location to your API
      await sendLocationToApi(locationData);
    }
  }
});

// Function to send location data to the API
const sendLocationToApi = async (coords) => {
  const BASE = 'https://api.acetaxisdorset.co.uk';
  const url = `${BASE}/api/UserProfile/UpdateGPS`;

  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer YOUR_TOKEN_HERE`, // You may need to pass the token dynamically
    };

    await axios.post(url, coords, { headers });
    console.log('Location sent to API');
  } catch (error) {
    console.error('Error sending location to API:', error);
  }
};

// Function to start background location updates
export const startBackgroundUpdate = async () => {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  if (status === 'granted') {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: 1000,
      distanceInterval: 0,
      pausesUpdatesAutomatically: false,
    });
  } else {
    console.error('Background location permission not granted');
  }
};

// Function to stop background location updates
export const stopBackgroundUpdate = async () => {
  await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
};
