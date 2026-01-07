import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

export default function LogoutScreen({ setUser }) {
  useEffect(() => {
    // Déconnecte l'utilisateur immédiatement
    setUser(null);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.text}>Déconnexion…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F6F6",
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: "#333",
  },
});
