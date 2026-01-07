import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "../Admin/adminConfig";

const { width } = Dimensions.get("window");

export default function LoginScreen({ navigation, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // --- NOUVEAU : État pour gérer la visibilité du mot de passe ---
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Animation Values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Erreur de connexion au serveur");
      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.topDecoration} />

      <Animated.View 
        style={[
          styles.contentContainer, 
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        {/* HEADER IMAGE */}
        <View style={styles.headerContainer}>
          <Image 
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/2919/2919600.png" }} 
            style={styles.logo} 
          />
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue reading</Text>
        </View>

        {/* FORM CONTAINER */}
        <View style={styles.formContainer}>
          
          {/* EMAIL INPUT */}
          <View style={styles.inputWrapper}>
            <Ionicons name="mail" size={20} color="#9CA3AF" style={styles.icon} />
            <TextInput
              placeholder="Email Address"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* PASSWORD INPUT (Modifié) */}
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed" size={20} color="#9CA3AF" style={styles.icon} />
            
            <TextInput
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              // --- CHANGEMENT 1 : Si visible est false, on cache le texte ---
              secureTextEntry={!isPasswordVisible} 
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
            
            {/* --- CHANGEMENT 2 : Bouton pour changer l'état --- */}
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <Ionicons 
                // Change l'icône selon l'état
                name={isPasswordVisible ? "eye-outline" : "eye-off-outline"} 
                size={22} 
                color="#6B7280" // Un gris un peu plus foncé pour être visible
              />
            </TouchableOpacity>

          </View>

          {/* LOGIN BUTTON */}
          <TouchableOpacity
            onPress={handleLogin}
            activeOpacity={0.8}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>LOG IN</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 5 }} />
          </TouchableOpacity>

        </View>

        {/* SIGNUP LINK FOOTER */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.signupText}>Sign up</Text>
          </TouchableOpacity>
        </View>
        
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topDecoration: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(76, 63, 216, 0.1)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  
  // Header
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain'
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },

  // Form inputs
  formContainer: {
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6", 
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 16, 
    marginBottom: 15,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  
  // Forgot Password
  forgotPassContainer: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  forgotPassText: {
    color: "#4C3FD8",
    fontWeight: "600",
    fontSize: 14,
  },

  // Button
  loginButton: {
    backgroundColor: "#4C3FD8",
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: "#4C3FD8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8, 
  },
  loginButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },

  // Footer
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },
  footerText: {
    color: "#6B7280",
    fontSize: 15,
  },
  signupText: {
    color: "#4C3FD8",
    fontWeight: "800",
    fontSize: 15,
  },
});