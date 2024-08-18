import { Dimensions, StyleSheet, Text, View, Platform } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import notificationContext from "../context/NotificationContext";
import BookingDetailContext from "../context/BookingDetailContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const { width, height } = Dimensions.get("window");

const Notification = () => {
  // const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();
  const [notification, setNotification] = useState(false);

  const { setBookingDetails } = useContext(BookingDetailContext);
  const { expoToken, setExpoToken, setModalVisible } =
    useContext(notificationContext);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        setExpoToken(token);
        console.log("token", expoToken );
      })
      .catch((err) => console.log(err));

    
    // Check for a notification response when the app is launched or resumed
    const checkInitialNotification = async () => {
      const response = await Notifications.getLastNotificationResponseAsync();
      console.log("Response", response);

      if (response) {
        const bookingInfo =
          response.notification.request.content.data.bookinginfo;
        setBookingDetails(bookingInfo);

        const { pickupAddress, destinationAddress } =
          response.notification.request.content.data.bookinginfo;

        if (pickupAddress === undefined || destinationAddress === undefined) {
          
          setModalVisible(false);
        } else {
          console.log("modal is set to visible");
          setModalVisible(true);
        }
      }
    };
    checkInitialNotification();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        console.log("received notification :", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "NOTIFICATION RESPONSE RECEIVED:",
          response.notification.request.content.data
        );

        const bookingInfo =
          response.notification.request.content.data.bookinginfo;

        const { pickupAddress, destinationAddress } =
          response.notification.request.content.data.bookinginfo;

        if (pickupAddress && destinationAddress) {
          setBookingDetails(bookingInfo);

          console.log("Setting modal to visible");
          setModalVisible(true);
        } else {
          console.log(
            "Notification data is missing 'pickupAddress' or 'to' destinationAddress"
          );
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(()=>{
    submitDriverId();
  },[expoToken])

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }

      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;
        if (!projectId) {
          throw new Error("Project ID not found");
        }
        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      } catch (e) {
        console.log("Error getting Expo push token", e);
        token = `${e}`;
      }
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  // send driver id & Expo push Token to Backend

  function submitDriverId() {
    fetch("https://mobile-notifiation-registraion.onrender.com", {
      // Replace with your actual backend URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: expoToken, userId:8 }), // Send driverId & expoPushToken to the backend
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(
          "expoToken & driver  ID sent to backend successfully:",
          data
        );
      })
      .catch((error) => {
        console.error("Error sending Driver ID to backend:", error);
        alert("Failed to send Driver ID. Please try again.");
      });
  }
  return <></>;
};

export default Notification;

const styles = StyleSheet.create({});
