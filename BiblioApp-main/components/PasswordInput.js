import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PasswordInput = ({ value, onChangeText, placeholder }) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <View style={styles.passwordContainer}>
      <TextInput
        style={styles.passwordInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={!isVisible}
      />
      <TouchableOpacity
        onPress={() => setIsVisible(!isVisible)}
        style={styles.eyeIcon}
      >
        <Ionicons
          name={isVisible ? "eye-off-outline" : "eye-outline"}
          size={22}
          color="#888"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEE",
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 5,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: { padding: 10 },
});

export default PasswordInput;