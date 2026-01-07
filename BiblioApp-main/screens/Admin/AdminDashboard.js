import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "./adminConfig";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) return;

      const user = JSON.parse(storedUser);
      const res = await fetch(`${API_BASE}/admin/dashboard.php?action=list`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ user_id: user.id }).toString()
      });
      const data = await res.json();
      setStats(data);
    };
    loadStats();
  }, []);

  if (!stats) return <ActivityIndicator size="large" color="#4C3FD8" style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />;

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, color: "#6C63FF" },
    { label: "Total Stories", value: stats.totalStories, color: "#FF6B6B" },
    { label: "Total Favorites", value: stats.totalFavorites, color: "#4CAF50" }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <View style={styles.statsContainer}>
        {statCards.map((s, i) => (
          <View key={i} style={[styles.card, { backgroundColor: s.color }]}>
            <Text style={styles.cardValue}>{s.value}</Text>
            <Text style={styles.cardLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.subtitle}>Top Stories</Text>
      <FlatList
        data={stats.topStories}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.storyItem}>
            <Text style={styles.storyTitle}>{item.title}</Text>
            <Text style={styles.storyFav}>{item.fav_count} favorites</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F6FA"
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333"
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    marginVertical: 15,
    color: "#555"
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },
  card: {
    flex: 1,
    padding: 25,
    borderRadius: 20,
    marginHorizontal: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff"
  },
  cardLabel: {
    fontSize: 16,
    color: "#fff",
    marginTop: 8
  },
  storyItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1
  },
  storyFav: {
    fontSize: 14,
    color: "#888",
    marginLeft: 10
  }
});
