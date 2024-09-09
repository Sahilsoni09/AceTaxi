import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { fetchJobRequestByIdAndStatus } from "../util/database";
import BookingDetailContext from "../context/BookingDetailContext";
import NoJobsFound from "../components/NoJobFound";
import LogContext from "../context/LogContext";
import { useRoute } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const ActiveRide = () => {
  const { response } = useContext(BookingDetailContext);
  const {isTestApi} = useContext(LogContext);
  const [booking, setBooking] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Update Job Status"); // Initial button label

  const route = useRoute();
  console.log("ROUTE, ", route);
  
  useEffect(() => {
    const loadActiveBooking = async () => {
      try {
        if (response.action === 0) {
          const activeBooking = await fetchJobRequestByIdAndStatus(
            response.jobno,
            0
          );
          setBooking(activeBooking);
          setSelectedStatus("Update Job Status");
        }
      } catch (error) {
        console.error("Error fetching active booking:", error);
      }
    };

    loadActiveBooking();
  }, [response]);

  const handleStatusUpdate = (status) => {
    setSelectedStatus(status); // Update button label to selected status
    setShowDropdown(false); // Hide dropdown

    console.log(`Updating status to: ${status}`);
    // Add logic to update the booking status in your database or state

    const statusMapping = {
      "At Pickup": 0,
      "Passenger On Board": 1,
      "Soon to Clear": 2,
      "Clear": 3,
    };
  
    // Get the newStatus based on the selected status
    const newStatus = statusMapping[status];
    console.log("newStatus: " , newStatus);
  
    if (newStatus === undefined) {
      console.error("Invalid status:", status);
      return;
    }

    const BASE = isTestApi
    ? "https://abacusonline-001-site1.atempurl.com"
    : "https://api.acetaxisdorset.co.uk";
  
  console.log(`Using ${isTestApi ? "test" : "live"} API for notification response`);
  
  const url = `${BASE}/api/DriverApp/JobStatusReply?jobno=${response.jobno}&newStatus=${newStatus}`;

    // try {
    //   const headers = {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${authCtx.tokenRef.current}`, // Use the token from context
    //   };
    //   const response = await axios.get(url,{ headers });
    //   console.log("JobOfferReply send to api:", response);
    // } catch (error) {
    //   console.error("Error sending jobOfferReply to API:", error);
    //   addLog(`Error sending jobOfferReply to API: ${error.message}`);
    //   Sentry.captureException(
    //     new Error(`Error sending jobOfferReply to API: ${error.message}`)
    //   );
    // }

    if (status === "Clear") setBooking([]);
  };

  if (!booking || booking.length === 0) {
    return (
      <View>
        <NoJobsFound message="No active booking found" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>
            Booking ID: <Text style={styles.value}>{booking[0].bookingId}</Text>
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>
            Passenger Name:{" "}
            <Text style={styles.value}>{booking[0].passenger}</Text>
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>
            Pickup: <Text style={styles.value}>{booking[0].pickup}</Text>
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>
            Destination:{" "}
            <Text style={styles.value}>{booking[0].destination}</Text>
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>
            Price: <Text style={styles.value}>£{booking[0].price}</Text>
          </Text>
        </View>

        {/* Button to update job status */}
        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text style={styles.updateButtonText}>{selectedStatus}</Text>
        </TouchableOpacity>

        {/* Dropdown menu for status options */}
        {showDropdown && (
          <View style={styles.dropdown}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleStatusUpdate("At Pickup")}
            >
              <Text style={styles.dropdownText}>At Pickup</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleStatusUpdate("Passenger On Board")}
            >
              <Text style={styles.dropdownText}>Passenger On Board</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleStatusUpdate("Soon to Clear")}
            >
              <Text style={styles.dropdownText}>Soon to Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleStatusUpdate("Clear")}
            >
              <Text style={styles.dropdownText}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default ActiveRide;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    padding: height * 0.02,
  },
  card: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#fff",
    padding: height * 0.02,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
    marginVertical: height * 0.003,
  },
  row: {
    marginBottom: height * 0.01,
  },
  label: {
    fontWeight: "600",
    fontSize: Math.min(width * 0.045, height * 0.03),
    color: "#444",
    fontFamily: "Roboto-Bold",
  },
  value: {
    fontSize: Math.min(width * 0.04, height * 0.028),
    marginTop: 4,
    color: "#555",
    fontFamily: "Roboto-Regular",
  },
  updateButton: {
    backgroundColor: "#CD1A21",
    paddingVertical: height * 0.015,
    borderRadius: 8,
    alignItems: "center",
    marginTop: height * 0.015,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: Math.min(width * 0.045, height * 0.03),
    fontFamily: "Roboto-Bold",
  },
  dropdown: {
    marginTop: height * 0.01,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
  },
  dropdownItem: {
    padding: height * 0.015,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  dropdownText: {
    fontSize: Math.min(width * 0.04, height * 0.028),
    fontFamily: "Roboto-Regular",
    color: "#333",
  },
});
