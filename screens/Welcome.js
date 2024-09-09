import { StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import BatteryOptimizationHandler from '../components/BatteryOptimizationHandler';
import BackgroundLocationTracker from '../components/BackgroundLocationTask';

const Welcome = () => {
  

  return (
    <View style={styles.container}>
      
      <BatteryOptimizationHandler/>
      <BackgroundLocationTracker/>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },

});
