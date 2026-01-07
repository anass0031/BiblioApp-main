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
import { API_BASE } from "../Admin/adminConfig";

const { width } = Dimensions.get("window");

export default function SignupScreen({ navigation }) {
  // --- ÉTATS ---
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // État pour l'œil (voir/cacher mot de passe)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // --- ANIMATIONS (Identiques au Login) ---
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

  // --- FONCTION SIGNUP (Ta logique originale) ---
  const handleSignup = async () => {
    try {
      const response = await fetch(API_BASE + "/auth/signup.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (data.success) {
        alert("Account created successfully!");
        navigation.navigate("Login");
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
      {/* Forme décorative (Cercle en haut à droite) */}
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
            // Image différente pour Signup
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/747/747376.png" }} 
            style={styles.logo} 
          />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us and start reading today!</Text>
        </View>

        {/* FORM CONTAINER */}
        <View style={styles.formContainer}>
          
          {/* USERNAME INPUT (Nouveau) */}
          <View style={styles.inputWrapper}>
            <Ionicons name="person" size={20} color="#9CA3AF" style={styles.icon} />
            <TextInput
              placeholder="Username"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
            />
          </View>

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

          {/* PASSWORD INPUT */}
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed" size={20} color="#9CA3AF" style={styles.icon} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!isPasswordVisible} 
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
            {/* Bouton Œil */}
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <Ionicons 
                name={isPasswordVisible ? "eye-outline" : "eye-off-outline"} 
                size={22} 
                color="#6B7280" 
              />
            </TouchableOpacity>
          </View>

          {/* SIGNUP BUTTON */}
          <TouchableOpacity
            onPress={handleSignup}
            activeOpacity={0.8}
            style={styles.loginButton} // Utilise le même style que LoginButton
          >
            <Text style={styles.loginButtonText}>SIGN UP</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 5 }} />
          </TouchableOpacity>

        </View>

        {/* FOOTER LINK */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.signupText}>Log in</Text>
          </TouchableOpacity>
        </View>
        
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

// --- STYLES IDENTIQUES AU LOGIN SCREEN ---
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