// OnlineStatusIndicator.js
import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import LogContext from '../context/LogContext';
import * as Sentry from "@sentry/react-native";

const OnlineStatusIndicator = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [connectivity, setConnectivity] = useState(" ");

  const { addLog } = useContext(LogContext);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
      // if (!state.isConnected) {
			// 	showAlert();
			// }
      if(state.isConnected){
        setConnectivity("Online");
        addLog("Device is Online");
        Sentry.captureMessage(
          `Log: Device is Online`,
          "log"
        );
      }
      else{
        setConnectivity("Offline");
        addLog("Device is Offline");
        Sentry.captureMessage(
          `Log: Device is Offline`,
          "log"
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // const showAlert = () => {
	// 	Alert.alert(
	// 		'Internet Connection',
	// 		'You are offline. Some features may not be available.'
	// 	);
	// };

  return (
    <View style ={styles.container}>
    <View style={[styles.statusIndicator, { backgroundColor: isOnline ? 'green' : 'red' }]} >
    </View>
    <Text style ={{fontFamily: 'Roboto-Bold'}}>{connectivity}</Text>
    </View>

  );
};

const styles = StyleSheet.create({
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  container: {
    
    flexDirection: 'row'
  }
});

export default OnlineStatusIndicator;
