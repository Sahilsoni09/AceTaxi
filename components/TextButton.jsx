import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const TextButton = ({children, onPress}) => {
  return (
   
        <TouchableOpacity onPress={onPress} style={styles.textButton}>
            <Text style={styles.textButtonText}>{children}</Text>
        </TouchableOpacity>
    
  )
}

export default TextButton

const styles = StyleSheet.create({
    
      textButton: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        paddingVertical: screenHeight * 0.015,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: screenWidth * 0.01,
        borderWidth: 0.3,
        borderColor: '#000',
        
      },
      textButtonText: {
        color: '#000',
        fontSize: screenWidth * 0.03,
        fontFamily: 'Roboto-Regular',
      },
})