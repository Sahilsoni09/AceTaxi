import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect } from 'react'

import BackgroundLocationTracker from '../components/BackgroundLocationTask'
import { AuthContext } from '../context/AuthContext'
import BatteryOptimizationHandler from '../components/BatteryOptimizationHandler'



const BackgroundLocationScreen = () => {

  const authCtx = useContext(AuthContext);
  token = authCtx.token;

  

  // Trigger a re-render when the token changes
  useEffect(() => {
    console.log("Background location screen, token changed:", token);

    // You could potentially reset other states here if needed

  }, [token]); 
  
  return (
    <View style ={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
      <BatteryOptimizationHandler/>
      <BackgroundLocationTracker/>
      
    </View>
  )
}

export default BackgroundLocationScreen

const styles = StyleSheet.create({})