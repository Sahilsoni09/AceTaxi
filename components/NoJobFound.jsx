import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const NoJobsFound = ({ message }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="warning-outline" size={24} color="#f5a623" style={styles.icon} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7e6',
    padding: width * 0.03,
    borderRadius: width * 0.02,
    marginVertical: height * 0.01,
  },
  icon: {
    marginRight: width * 0.02,
  },
  text: {
    color: '#f5a623',
    fontSize: width * 0.04,
  },
});

export default NoJobsFound;
