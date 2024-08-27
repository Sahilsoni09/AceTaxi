import React, { useContext } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions } from "react-native";
import LogContext from "../context/LogContext";

const LogScreen = () => {
  const { logs, clearLogs } = useContext(LogContext);
  const { width } = Dimensions.get("window");

  return (
    <View style={styles.container}>
      {logs.length === 0 ? (
        <Text style={styles.emptyText}>No Logs Available</Text>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.logItem, { width: width * 0.9 }]}>
              <Text style={styles.logMessage}>
                {item.timestamp.toLocaleTimeString()}: {item.message}
              </Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={[styles.clearButton, { width: width * 0.9 }]} onPress={clearLogs}>
        <Text style={styles.clearButtonText}>Clear Logs</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    paddingTop: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  logItem: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  logMessage: {
    fontSize: 14,
    color: "#333",
    lineHeight: 18,
  },
  clearButton: {
    backgroundColor: "#CD1A21",
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default LogScreen;
