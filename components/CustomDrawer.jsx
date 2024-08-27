import React, { useContext } from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
// import { useTheme } from '../context/ThemeContext';


const CustomDrawerContent = (props) => {
  // const { colorScheme, toggleTheme } = useTheme();
  
  const authCtx = useContext(AuthContext);

  const handleLogout = () => {
    authCtx.logout();
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/Ace.png')} style={styles.logo} />
      </View>

      {/* <TouchableOpacity onPress={toggleTheme} style={styles.themeToggleButton}>
        <Text style={styles.themeToggleText}>
          Toggle Theme
        </Text>
      </TouchableOpacity> */}

      <DrawerItemList {...props} />

      <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
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
  // Uncomment and modify the following styles if using theme toggle
  // themeToggleButton: {
  //   marginVertical: 10,
  //   padding: 10,
  //   borderRadius: 5,
  //   backgroundColor: '#f0f0f0',
  // },
  // themeToggleText: {
  //   color: '#000',
  // },
  logoutContainer: {
    marginTop: 'auto', // Pushes the logout button to the bottom
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  logoutButton: {
    backgroundColor: '#CD1A21', // Red color for logout button
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CustomDrawerContent;
