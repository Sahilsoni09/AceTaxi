import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
// import { GOOGLE_MAPS_APIKEY } from "@env";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Map = () => {

  const route = useRoute();
  console.log("route: ", route); 
  const {
    pickup,
    pickupPostCode,
    destination,
    destinationPostCode,
    vias = [],
    timestamp,
  } = route.params; // vias is an array of intermediate stops

  // State to manage the region displayed on the map
  const [region, setRegion] = useState({
    latitude: 51.5074, // Default location (e.g., London)
    longitude: -0.1278,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta:LONGITUDE_DELTA,
  });

  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [viasCoords, setViasCoords] = useState([]);

  useEffect(() => {

    // Function to geocode an address and postal code into coordinates
    const geocodeAddress = async (address, postCode) => {
      const fullAddress = `${address},${postCode}`;
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            fullAddress
          )} &key=AIzaSyD4pR99wUBL7JtFDAibNJnVAwBddoRLwZw`
        );
        const data = await response.json();
        if (data.results.length > 0) {
          const location = data.results[0].geometry.location;
          return {
            latitude: location.lat,
            longitude: location.lng,
          };
        } else {
          throw new Error("Address not found");
        }
      } catch (error) {
        console.error("Error in geocoding address:", error);
        return null;
      }
    };

    // Function to fetch coordinates for pickup, destination, and vias
    const fetchCoordinates = async () => {
      const pickupCoords = await geocodeAddress(pickup, pickupPostCode);
      const destinationCoords = await geocodeAddress(destination,destinationPostCode);
      const viasCoordsPromises = vias.map((via) => geocodeAddress(via));
      const viasCoords = await Promise.all(viasCoordsPromises);

      if (pickupCoords && destinationCoords) {
        setPickupCoords(pickupCoords);
        setDestinationCoords(destinationCoords);
        setViasCoords(viasCoords.filter((coords) => coords !== null)); // Filter out any failed geocodings

        // Adjust the region to fit all coordinates (pickup, vias, destination)
        const allCoords = [pickupCoords, ...viasCoords, destinationCoords];
        const latitudes = allCoords.map((coord) => coord.latitude);
        const longitudes = allCoords.map((coord) => coord.longitude);

        const minLatitude = Math.min(...latitudes);
        const maxLatitude = Math.max(...latitudes);
        const minLongitude = Math.min(...longitudes);
        const maxLongitude = Math.max(...longitudes);

        setRegion({
          latitude: (minLatitude + maxLatitude) / 2,
          longitude: (minLongitude + maxLongitude) / 2,
          latitudeDelta: maxLatitude - minLatitude + 0.05,
          longitudeDelta: maxLongitude - minLongitude + 0.15,
        });
      }
    };

    fetchCoordinates();
  }, [pickup, destination, vias,timestamp]);

  return (
    <View style={styles.container}>
      {pickupCoords && destinationCoords ? (
        <MapView
          style={styles.map}  
          region={region}  
          initialRegion={region}
          showsUserLocation={true}
          loadingEnabled={true}
        >
          <Marker coordinate={pickupCoords} title="Pickup Location" />
          {viasCoords.map((viaCoord, index) => (
            <Marker key={`via-${index}`} coordinate={viaCoord} title={`Via ${index + 1}`} />
          ))}
          <Marker coordinate={destinationCoords} title="Destination Location" />

          <MapViewDirections
            origin={pickupCoords}
            destination={destinationCoords}
            waypoints={viasCoords}
            apikey={"AIzaSyD4pR99wUBL7JtFDAibNJnVAwBddoRLwZw"} 
            strokeWidth={3}
            strokeColor="#CD1A21"
          />
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>  
          <Text style={styles.loadingText}>Loading map...</Text>  
        </View>
      )}
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: "100%",  
    height: "100%",  
  },
  loadingContainer: {
    flex: 1,  
    justifyContent: "center",  
    alignItems: "center",  
  },
  loadingText: {
    fontSize: 18,  
    fontWeight: "bold",  
  },
});
