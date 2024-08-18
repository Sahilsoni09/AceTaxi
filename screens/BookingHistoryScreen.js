import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";
import { fetchJobRequestHistory } from "../util/database";
import BookingDetailContext from "../context/BookingDetailContext";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRoute } from "@react-navigation/native";

const BookingHistoryScreen = ({ navigation }) => {
  const [jobHistory, setJobHistory] = useState([]);

  const route = useRoute();
  console.log("ROUTE, ", route);

  // Render a single item in the job history list
  const renderItem = ({ item }) => (
    <View style={styles.jobItem}>
      {/* Row for Booking ID and Status */}
      <View style={styles.rowContainer}>
        <Text style={styles.jobTitle}>Booking ID: {item.bookingId}</Text>
        <View style={styles.statusContainer}>
          <Text
            style={[
              styles.statusText,
              item.status.includes("Accepted")
                ? styles.statusAccepted
                : styles.statusDeclined,
            ]}
          >
            {item.status.includes("Accepted") ? "✅Accepted" : "❌Declined"}
          </Text>
        </View>
      </View>

      {/* Details */}
      <Text style={styles.jobDetail}>
        <Text style={styles.label}>Passenger:</Text> {item.passenger}
      </Text>
      <Text style={styles.jobDetail}>
        <Text style={styles.label}>Pickup:</Text> {item.pickup}
      </Text>
      <Text style={styles.jobDetail}>
        <Text style={styles.label}>Destination:</Text> {item.destination}
      </Text>
      <Text style={styles.jobDetail}>
        <Text style={styles.label}>Price:</Text> £{item.price}
      </Text>

      {/* Map Open */}
      <TouchableOpacity
        style={styles.mapButton}
        onPress={() =>
          openMap(
            item.pickup,
            item.pickupPostCode,
            item.destination,
            item.destinationPostCode,
            item.vias
          )
        } // Define the openMap function to handle navigation to map screen
      >
        <Text style={styles.mapButtonText}>View on Map</Text>
      </TouchableOpacity>
    </View>
  );

  const openMap = (
    pickup,
    pickupPostCode,
    destination,
    destinationPostCode,
    vias =[],
  ) => {
    navigation.navigate("Map", {
      pickup: pickup,
      pickupPostCode: pickupPostCode,
      destination: destination,
      destinationPostCode: destinationPostCode,
      vias, // Add vias if needed

      timestamp: Date.now()
    });
  };

  useEffect(() => {
    fetchJobRequestHistoryFromDB(); // Fetch job history on component mount
  }, [route.params?.timestamp]); // Empty dependency array to run the effect only once on component mount

  const fetchJobRequestHistoryFromDB = async () => {
    console.log("Fetching job history");
    try {
      const history = await fetchJobRequestHistory();
      console.log("history: ", history);
      setJobHistory(history); // Update the state with fetched job history
    } catch (error) {
      console.error("Error fetching job history from DB:", error);
    }
  };
  console.log("job history:", jobHistory);

  return (
    <>
      {/* <StatusBar style="light" backgroundColor="#CD1A21" /> */}
      <SafeAreaView style={styles.container}>
        {/* Custom Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking History</Text>
        </View>

        {/* FlatList to display job history */}
        <FlatList
          data={jobHistory.reverse()}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          style={{ width: "100%" }}
          contentContainerStyle={{ paddingBottom: 50, paddingHorizontal: 20 }}
        />
      </SafeAreaView>
    </>
  );
};

export default BookingHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  header: {
    width: "100%",
    padding: 20,
    backgroundColor: "#CD1A21",
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
  },

  jobItem: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  jobDetail: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
  },
  label: {
    fontWeight: "bold",
    color: "#444",
  },
  statusContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statusAccepted: {
    color: "green",
  },
  statusDeclined: {
    color: "red",
  },
  mapButton: {
    backgroundColor: "#CD1A21",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  mapButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
