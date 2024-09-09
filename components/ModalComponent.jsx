import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext } from "react";
import axios from "axios";
import BookingDetailContext from "../context/BookingDetailContext";
import { useNavigation } from "@react-navigation/native";
import {
  fetchJobRequestHistory,
  insertJobRequestHistory,
} from "../util/database";
import BookingHistoryScreen from "../screens/BookingHistoryScreen";
import notificationContext from "../context/NotificationContext";
import LogContext from "../context/LogContext";
import { AuthContext } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");

const ModalComponent = () => {
   console.log("modal component called ");

  const { modalVisible, setModalVisible } = useContext(notificationContext);
  const { BookingDetails, setBookingDetails, setResponse } =
    useContext(BookingDetailContext);

  const navigation = useNavigation();
  const {isTestApi} = useContext(LogContext);
  const authCtx = useContext(AuthContext);
  const { addLog } = useContext(LogContext);


  const handleJobResponse = async (response) => {

    console.log("Response", response);
    const BASE = isTestApi
    ? "https://abacusonline-001-site1.atempurl.com"
    : "https://api.acetaxisdorset.co.uk";
  
  console.log(`Using ${isTestApi ? "test" : "live"} API for notification response`);
  
  const url = `${BASE}/api/DriverApp/JobOfferReply?jobno=${BookingDetails.bookingId}&accepted=${response}`;

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

    fetch("https://testingpushnotification.onrender.com/dispatch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        response,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response sent to backend:", data);
      })
      .catch((error) => {
        console.error("Error sending response to backend:", error);
        alert("Failed to send response. Please try again.");
      });

    setModalVisible(false);
   

    const {
      bookingId,
      passengerName,
      pickupAddress,
      pickupPostCode,
      destinationAddress,
      destinationPostCode,
      vias,
      price,
    } = BookingDetails;

    console.log(
      "bookingId: ",
      bookingId,
      "passengerName: ",
      passengerName,
      "pickupAddress: ",
      pickupAddress,
      "pickupPostCode: ",
      pickupPostCode,
      "destinationAddress:",
      destinationAddress,
      "destinationPostCode: ",
      destinationPostCode,
      "vias",
      vias
    );

    

    insertJobRequestHistory(
      bookingId,
      passengerName,
      pickupAddress,
      pickupPostCode,
      destinationAddress,
      destinationPostCode,
      vias,
      price,
      response
    )
      .then(() => {
        console.log("Data inserted successfully");

        if(response === 0){
          navigation.navigate("Active Ride", {
            screen: "Active Ride",
            params: { timestamp: Date.now() },
          });
        }else{
          console.log("driver decline the new job");
        }
        
      })
      .catch((error) => {
        console.error("Error inserting data:", error);
      });

      setResponse({
        jobno: bookingId,
        action: response,
      });

  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)", // Darker overlay for better focus
        }}
      >
        <View
          style={{
            width: width * 0.85, // 85% of screen width
            backgroundColor: "white",
            padding: width * 0.05, // 5% of screen width for padding
            borderRadius: 15, // More rounded corners
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 8,
          }}
        >
          <Text
            style={{
              marginBottom: height * 0.02, // 2% of screen height
              fontSize: width * 0.05, // Responsive font size
              fontWeight: "600",
              fontFamily: 'Roboto-Bold',
              textAlign: "center",
              color: "#333",
            }}
          >
            New Job Request
          </Text>

          <View style={{ marginBottom: height * 0.01 }}>
            <Text
              style={{
                fontSize: width * 0.040, // Responsive font size
                fontFamily: 'Roboto-Bold',
                color: "#555",
              }}
            >
              Passenger Name:
            </Text>
            <Text
              style={{
                fontSize: width * 0.035, // Responsive font size
                fontFamily: 'Roboto-Regular',
                color: "#000",
              }}
            >
              {BookingDetails?.passengerName}
            </Text>
          </View>

          <View style={{ marginBottom: height * 0.01 }}>
            <Text
              style={{
                fontSize: width * 0.040, // Responsive font size
                fontFamily: 'Roboto-Bold',
                color: "#555",
              }}
            >
              Pickup Address:
            </Text>
            <Text
              style={{
                fontSize: width * 0.035, // Responsive font size
                fontFamily: 'Roboto-Regular',
                color: "#000",
              }}
            >
              {BookingDetails?.pickupAddress}
            </Text>
          </View>

          <View style={{ marginBottom: height * 0.01 }}>
            <Text
              style={{
                fontSize: width * 0.040, // Responsive font size
                fontFamily: 'Roboto-Bold',
                color: "#555",
              }}
            >
              Destination Address:
            </Text>
            <Text
              style={{
                fontSize: width * 0.035, // Responsive font size
                fontFamily: 'Roboto-Regular',
                color: "#000",
              }}
            >
              {BookingDetails?.destinationAddress}
            </Text>
          </View>

          <View style={{ marginBottom: height * 0.01 }}>
            <Text
              style={{
                fontSize: width * 0.040, // Responsive font size
                fontFamily: 'Roboto-Bold',
                color: "#555",
              }}
            >
              Pickup Date & Time:
            </Text>
            <Text
              style={{
                fontSize: width * 0.035, // Responsive font size
                fontFamily: 'Roboto-Regular',
                color: "#000",
              }}
            >
              {new Date(BookingDetails?.pickupDateTime).toLocaleString()}
            </Text>
          </View>

          <View style={{ marginBottom: height * 0.01 }}>
            <Text
              style={{
                fontSize: width * 0.040, // Responsive font size
                fontFamily: 'Roboto-Bold',
                color: "#555",
              }}
            >
              Price:
            </Text>
            <Text
              style={{
                fontSize: width * 0.035, // Responsive font size
                fontFamily: 'Roboto-Regular',
                color: "#000",
              }}
            >
              £{BookingDetails?.price}
            </Text>
          </View>

          <View style={{ marginBottom: height * 0.02 }}>
            <Text
              style={{
                fontSize: width * 0.040, // Responsive font size
                fontFamily: 'Roboto-Bold',
                color: "#555",
              }}
            >
              Phone Number:
            </Text>
            <Text
              style={{
                fontSize: width * 0.035, // Responsive font size
                fontFamily: 'Roboto-Regular',
                color: "#000",
              }}
            >
              {BookingDetails?.phoneNumber}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#4CAF50",
                paddingVertical: height * 0.015, // Responsive padding
                paddingHorizontal: width * 0.05, // Responsive padding
                borderRadius: 25,
                width: "45%",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 3,
              }}
              onPress={() => handleJobResponse(0)}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: width * 0.045, // Responsive font size
                  fontFamily: 'Roboto-Bold',
                }}
              >
                Accept
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#F44336",
                paddingVertical: height * 0.015, // Responsive padding
                paddingHorizontal: width * 0.05, // Responsive padding
                borderRadius: 25,
                width: "45%",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 3,
              }}
              onPress={() => handleJobResponse(1)}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: width * 0.045, // Responsive font size
                  fontFamily: 'Roboto-Bold',
                }}
              >
                Decline
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalComponent;

const styles = StyleSheet.create({});
