// OnlineStatusIndicator.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const OnlineStatusIndicator = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [connectivity, setConnectivity] = useState(" ");

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
      // if (!state.isConnected) {
			// 	showAlert();
			// }
      if(state.isConnected){
        setConnectivity("Online");
      }
      else{
        setConnectivity("Offline");
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
    <Text>{connectivity}</Text>
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
