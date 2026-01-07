import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons'; // Expo icons, works out-of-the-box

import AdminDashboard from "./AdminDashboard";
import ManageStories from "./ManageStories";
import UsersList from "./UsersList";

const Drawer = createDrawerNavigator();

export default function AdminDrawer({ setUser }) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} setUser={setUser} />}
      screenOptions={{
        headerStyle: { backgroundColor: "#4C3FD8" },
        headerTintColor: "#fff",
        drawerStyle: { backgroundColor: "#F5F6FA", width: 250 },
        drawerActiveTintColor: "#4C3FD8",
        drawerLabelStyle: { fontSize: 16, fontWeight: "600" }
      }}
    >
      <Drawer.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: "Dashboard" }} />
      <Drawer.Screen name="ManageStories" component={ManageStories} options={{ title: "Manage Stories" }} />
      <Drawer.Screen name="UsersList" component={UsersList} options={{ title: "Users List" }} />
    </Drawer.Navigator>
  );
}

function CustomDrawerContent({ setUser, ...props }) {
  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    setUser(null);
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      <Text style={styles.drawerTitle}>Admin Panel</Text>

      <DrawerItem
        label="Dashboard"
        icon={() => <Ionicons name="home-outline" size={22} color="#4C3FD8" />}
        onPress={() => props.navigation.navigate("AdminDashboard")}
      />
      <DrawerItem
        label="Manage Stories"
        icon={() => <Ionicons name="book-outline" size={22} color="#4C3FD8" />}
        onPress={() => props.navigation.navigate("ManageStories")}
      />
      <DrawerItem
        label="Users List"
        icon={() => <Ionicons name="people-outline" size={22} color="#4C3FD8" />}
        onPress={() => props.navigation.navigate("UsersList")}
      />
      <View style={styles.logoutContainer}>
        <DrawerItem
          label="Logout"
          icon={() => <Ionicons name="log-out-outline" size={22} color="#FF5C5C" />}
          labelStyle={{ color: "#FF5C5C", fontWeight: "bold" }}
          onPress={handleLogout}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 30,
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 20,
    marginBottom: 20
  },
  logoutContainer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: "#EEE"
  }
});
