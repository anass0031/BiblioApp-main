import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "./adminConfig";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        if (parsedUser?.id) {
          fetchUsers(parsedUser.id);
        }
      }
    };
    loadUsers();
  }, []);

  const fetchUsers = async (userId) => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_BASE}/admin/listUsers.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ user_id: userId }).toString()
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.log("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4C3FD8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users List</Text>
      <FlatList
        data={users}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.role}>{item.role}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F6FA" },
  loadingContainer: { justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 15, color: "#333" },
  userCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  username: { fontSize: 16, fontWeight: "600", color: "#333" },
  role: { fontSize: 14, color: "#888" }
});
