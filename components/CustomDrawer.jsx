import React, { useContext, useEffect } from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import LogContext from "../context/LogContext";

const CustomDrawerContent = (props) => {
  const { theme, toggleTheme } = useTheme();

  const authCtx = useContext(AuthContext);
  

  const handleLogout = () => {
    authCtx.logout();
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.logoContainer}>
        <TouchableOpacity
          style={styles.circularButton}
          
          onPress={toggleTheme}
        >
          <Text
            style={styles.buttonText}
            className={`${theme === "dark" ? "text-white" : "text-black"}`}
          >
            {theme === "light" ? (
              <MaterialIcons name="dark-mode" size={24} color="black" />
            ) : (
              <MaterialIcons name="light-mode" size={24} color="white" />
            )}
          </Text>
        </TouchableOpacity>

        <Image source={require("../assets/Ace.png")} style={styles.logo} />
      </View>

     

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
    alignItems: "center",
    marginVertical: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  circularButton: {
    width: 50,
    height: 50,
    borderRadius: 25, // Circular shape
    
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -20, // Position the button at the top of the drawer
    right: 20, // Align it to the right side
  },
  buttonText: {
    fontSize: 24,
  },

  logoutContainer: {
    marginTop: "auto", // Pushes the logout button to the bottom
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  logoutButton: {
    backgroundColor: "#CD1A21", // Red color for logout button
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default CustomDrawerContent;
