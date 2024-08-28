import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  Linking,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as Battery from "expo-battery";
import LogContext from "../context/LogContext";
import * as Sentry from "@sentry/react-native";
import BookingDetailContext from "../context/BookingDetailContext";


const BatteryOptimizationHandler = () => {
  const [modalVisible, setModalVisible] = useState(false);
  
  const {addLog} = useContext(LogContext);

  const { isPermissionGranted,
    setIsPermissionGranted } = useContext(BookingDetailContext);
     
  useFocusEffect(
    React.useCallback(() => {
      const checkBatteryOptimization = async () => {
        if (Platform.OS === "android") {
          const isBatteryOptimizationEnabled =
            await Battery.isBatteryOptimizationEnabledAsync();

          if (isBatteryOptimizationEnabled) {
            addLog("Battery Optimization enabled Need to disable"); 
            Sentry.captureMessage("Battery Optimization enabled Need to disable", 'info');

            if(isPermissionGranted)
            setModalVisible(true); // Show the modal if battery optimization is enabled
          }else{
            addLog("Battery Saver disabled"); 
            Sentry.captureMessage("Battery Saver disabled", 'info');
          }
        }
      };

      checkBatteryOptimization();

      // Optional cleanup function if needed
      return () => {
        // Perform any cleanup if needed when the screen is unfocused
      };
    }, [isPermissionGranted]) // Empty dependency array means this effect runs on every screen focus
  );

  const openAppInfoScreen = () => {
    setModalVisible(false); // Close the modal

    if (Platform.OS === "android") {
      Linking.openSettings().catch((error) => {
        console.error("Failed to open app info screen:", error);
        Alert.alert("Error", "Failed to open app info screen.");
        Sentry.captureException(new Error(`Failed to open app info screen ${error.message}`));

      });
    } else if (Platform.OS === "ios") {
      Linking.openURL("app-settings:").catch((error) => {
        console.error("Failed to open app info screen:", error);
        Alert.alert("Error", "Failed to open app info screen.");
        Sentry.captureException(new Error(`Failed to open app info screen ${error.message}`));
      });
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Battery Saver Mode is enabled. To ensure optimal performance,
              please disable battery saver mode.
            </Text>

            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.button}
                onPress={openAppInfoScreen}
              >
                <Text style={styles.buttonText}>Go to App Info</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#CD1A21",
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default BatteryOptimizationHandler;
