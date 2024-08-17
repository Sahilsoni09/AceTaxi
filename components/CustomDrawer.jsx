import React from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Image, StyleSheet,  Text, TouchableOpacity} from 'react-native';
import { useTheme } from '../context/ThemeContext';


const CustomDrawerContent = (props) => {
  const { colorScheme, toggleTheme } = useTheme();

  return (
    <DrawerContentScrollView {...props}>
      <View 
      style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>

      <TouchableOpacity onPress={toggleTheme} className="mt-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800">
        <Text className={`${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
          Toggle Theme
        </Text>
      </TouchableOpacity>

      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});

export default CustomDrawerContent;
