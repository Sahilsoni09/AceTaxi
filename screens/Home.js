import {
  StyleSheet,
  Text,
  View,
  Switch,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { AuthContext } from "../context/AuthContext";
import Button from "../components/ui/Button";
import * as Sentry from "@sentry/react-native";
import { useTheme } from "../context/ThemeContext";
import LogContext from "../context/LogContext";

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const authCtx = useContext(AuthContext);
  const {theme} = useTheme();
  const {isTestApi, toggleApi} = useContext(LogContext);
  console.log("isTestApi", isTestApi);

  return (
    <SafeAreaView style={styles.safeArea} className = {theme === 'dark'? "bg-[#121212]":"bg-[#f0f0f0]"}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.insideHeader}>
            <Text style={styles.title} >Ace Taxis</Text>
            <Image
              source={require("../assets/logo-removebg-preview.png")}
              style={styles.logo}
            />
          </View>
          {/* <Ionicons name="notifications-outline" size={24} color="white" /> */}
        </View>
        <View style={styles.switchContainer} className = {theme === 'dark'? 'bg-[#4A4A4A]': 'bg-white'}>
          <Text style={{ fontFamily: "Roboto-Bold" }} className ={theme === "dark" ? "text-[#E0E0E0]" : "text-[#333]"}>
            Available/Unavailable
          </Text>
          <Switch />
        </View>

        {/* Add a switch for Test/Live API */}
        {/* <View style={styles.switchContainer} className={theme === "dark" ? "bg-[#4A4A4A]" : "bg-white"}>
          <Text style={{ fontFamily: "Roboto-Bold" }} className={theme === "dark" ? "text-[#E0E0E0]" : "text-[#333]"}>
            {isTestApi ? "Test API" : "Live API"}
          </Text>
          <Switch
            value={!isTestApi}
            onValueChange={toggleApi}
          />
        </View> */}

        <View style={styles.statsContainer} >
          <View style={styles.stat}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>total Earning</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>pending</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>complete</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>cancel Ride</Text>
          </View>
        </View>
        <Text style={styles.upcomingTitle} className ={theme=== 'dark'?'text-[#E0E0E0]': 'text-black'}>New Upcoming Ride</Text>
        <View style={styles.rideContainer}>
          <Image
            source={{
              uri: "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
            }}
            style={styles.avatar}
          />
          <View style={styles.rideDetails}>
            <Text style={styles.name}>Johnson Smithkover</Text>
            <Text style={styles.rating}>
              <Ionicons name="star" size={14} color="gold" /> 4.5
            </Text>
            <Text style={styles.km}>9.5 km</Text>
            <Text style={styles.date}>15 Dec'23 at 10:15 AM</Text>
            <Text style={styles.address}>
              220 Yonge St, Toronto, ON M5B 2H1, Canada
            </Text>
            <Text style={styles.address}>
              17600 Yonge St, Newmarket, ON L3Y 4Z1, Canada
            </Text>
          </View>
        </View>
        <Text style={styles.activeOfferTitle} className ={theme=== 'dark'?'text-[#E0E0E0]': 'text-black'}>Active Offer</Text>
        <View style={styles.rideContainer}>
          <Image
            source={{
              uri: "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
            }}
            style={styles.avatar}
          />
          <View style={styles.rideDetails}>
            <View style={styles.offerHeader}>
              <Text style={styles.name}>Johnson Smithkover</Text>
              <View style={styles.offerIcons}>
                <Ionicons name="create-outline" size={20} color="#555" />
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color="#555"
                  style={styles.offerIcon}
                />
              </View>
            </View>
            <Text style={styles.validity}>Valid till : 20/11/2023</Text>
            <Text style={styles.km}>9.5 km</Text>
            <Text style={styles.offerDetails}>
              Up to 10 km from Wankover city area{" "}
              <Text style={styles.offerPercentage}>30% OFF</Text>
            </Text>
            <Text style={styles.carDetails}>Mini sedan | 4 person</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              authCtx.setCounter((count) => count + 1);
            }}
          >
            <Text>test</Text>
          </TouchableOpacity>
        </View>
        {/* <Button title='Try!' onPress={ () => { Sentry.addBreadcrumb({
          category: "log",
          message: "testing",
          level: "info",
        }); }}/> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: "#f0f0f0",
  },
  container: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#CD1A21",
    padding: 16,
    borderRadius: 8,
  },
  insideHeader: {
    flexDirection: "row",
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  title: {
    color: "white",
    fontFamily: "Roboto-Bold",
    fontSize: 24,
    // fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: "white",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  stat: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    width: "48%",
    marginVertical: 4,
  },
  statValue: {
    fontSize: 24,
    fontFamily: "Roboto-Bold",
    // fontWeight: 'bold',
    color: "#CD1A21",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Roboto-Regular",
    color: "#555",
  },
  upcomingTitle: {
    fontSize: 18,
    fontFamily: "Roboto-Bold",
    // fontWeight: 'bold',
    marginVertical: 8,
  },
  activeOfferTitle: {
    fontSize: 18,
    fontFamily: "Roboto-Bold",
    // fontWeight: 'bold',
    marginVertical: 8,
  },
  rideContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  rideDetails: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: "Roboto-Bold",
    // fontWeight: 'bold',
  },
  rating: {
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    color: "#555",
    marginVertical: 2,
  },
  km: {
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    color: "#555",
    marginVertical: 2,
  },
  date: {
    fontSize: 12,
    fontFamily: "Roboto-Regular",
    color: "#555",
    marginVertical: 2,
  },
  address: {
    fontSize: 12,
    fontFamily: "Roboto-Regular",
    color: "#555",
    marginVertical: 2,
  },
  offerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  offerIcons: {
    flexDirection: "row",
  },
  offerIcon: {
    marginLeft: 8,
  },
  validity: {
    fontSize: 12,
    fontFamily: "Roboto-Regular",
    color: "#555",
    marginVertical: 2,
  },
  offerDetails: {
    fontSize: 12,
    fontFamily: "Roboto-Regular",
    color: "#555",
    marginVertical: 2,
  },
  offerPercentage: {
    color: "green",
    fontWeight: "bold",
  },
  carDetails: {
    fontSize: 12,
    fontFamily: "Roboto-Regular",
    color: "#555",
    marginVertical: 2,
  },
});
