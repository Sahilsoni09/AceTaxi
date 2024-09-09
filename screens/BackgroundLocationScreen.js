import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect } from 'react'

import BackgroundLocationTracker from '../components/BackgroundLocationTask'
import { AuthContext } from '../context/AuthContext'
import BatteryOptimizationHandler from '../components/BatteryOptimizationHandler'



const BackgroundLocationScreen = () => {

  
  return (
    <View style ={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
      <BatteryOptimizationHandler/>
      <BackgroundLocationTracker/>
    </View>
  )
}

export default BackgroundLocationScreen

const styles = StyleSheet.create({})