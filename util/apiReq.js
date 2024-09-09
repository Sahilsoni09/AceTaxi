import axios from "axios";
import * as Sentry from "@sentry/react-native";

export const sendLocationToApi = async ({
  coords,
  token,
  setLastSentTime,
  setApiStatus,
  addLog,
}) => {
  const BASE = "https://api.acetaxisdorset.co.uk";
  const url = `${BASE}/api/UserProfile/UpdateGPS`;

  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

// fucntion to submit driver id and expo token
export const submitDriverId = async ({ expoToken, driverId, addLog }) => {
  const url = "https://mobile-notifiation-registraion.onrender.com"; // Replace with your actual backend URL

  try {
    const response = await axios.post(url, {
      token: expoToken,
      userId: driverId,
    });

    console.log(
      "expoToken & driver ID sent to backend successfully:",
      response.data
    );
    addLog("expoToken & driver ID sent to backend successfully");
    Sentry.captureMessage(
      "Log: expoToken & driver ID sent to backend successfully",
      "log"
    );

    return response.data;
  } catch (error) {
    console.error("Error sending Driver ID to backend:", error);
    alert("Failed to send Driver ID. Please try again.");
    addLog(`Error sending Driver ID to backend: ${error.message}`);
    Sentry.captureException(
      new Error(`Error sending Driver ID to backend: ${error.message}`)
    );

    throw error;
  }
};
