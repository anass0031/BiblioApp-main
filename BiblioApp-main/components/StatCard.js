import React from "react";
import { View, Text, StyleSheet } from "react-native";

const StatCard = ({ label, value }) => (
  <View style={styles.container}>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 16,
    minWidth: 100,
    elevation: 2, // Ombre Android
    shadowColor: "#000", // Ombre iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4C3FD8",
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },
});

export default StatCard;