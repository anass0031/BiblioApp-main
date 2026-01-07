import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AdminDrawer from "./screens/Admin/AdminDrawer";
import LoginScreen from "./screens/Auth/LoginScreen";
import SignupScreen from "./screens/Auth/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import StoryDetailScreen from "./screens/StoryDetailScreen";
import FavoritesScreen from "./screens/User/FavoritesScreen";
import ProfileScreen from "./screens/User/ProfileScreen";
import CommentsScreen from "./screens/CommentsScreen"; 

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.log("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  function Tabs() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#4C3FD8",
          tabBarInactiveTintColor: "gray",
          tabBarIcon: ({ color, size }) => {
            let icon;
            if (route.name === "Home") icon = "home-outline";
            if (route.name === "Favorites") icon = "heart-outline";
            if (route.name === "Profile") icon = "person-outline";
            return <Ionicons name={icon} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home">
          {(props) => <HomeScreen {...props} user={user} setUser={setUser} />}
        </Tab.Screen>
        <Tab.Screen name="Favorites">
          {(props) => <FavoritesScreen {...props} user={user} />}
        </Tab.Screen>
        <Tab.Screen name="Profile">
          {(props) => <ProfileScreen {...props} user={user} setUser={setUser} />}
        </Tab.Screen>
      </Tab.Navigator>
    );
  }

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          user.role === "admin" ? (
            <Stack.Screen name="AdminDrawer">
                {(props) => <AdminDrawer {...props} setUser={setUser} />}
              </Stack.Screen>
          ) : (
            <>
              <Stack.Screen name="Tabs" component={Tabs} />
              <Stack.Screen
                name="StoryDetail"
                component={StoryDetailScreen}
              />
              
              {/* --- NOUVELLE ROUTE COMMENTAIRES --- */}
              <Stack.Screen 
                name="Comments" 
                component={CommentsScreen} 
                options={{ 
                  headerShown: true, 
                  headerTitle: "Commentaires",
                  headerTintColor: "#4C3FD8"
                }} 
              />
            </>
          )
        ) : (
          <>
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} setUser={setUser} />}
            </Stack.Screen>
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}