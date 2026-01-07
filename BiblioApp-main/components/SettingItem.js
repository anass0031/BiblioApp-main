import React from "react";
import { View, Text, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SettingItem = ({
  icon,
  text,
  onPress,
  isDestructive = false,
  hasSwitch = false,
  switchValue,
  onSwitchChange,
  subtitle,
}) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={hasSwitch ? () => onSwitchChange(!switchValue) : onPress}
    activeOpacity={0.7}
  >
    <View style={styles.settingLeft}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: isDestructive ? "#FFEBEE" : "#F0F0FA" },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={isDestructive ? "#FF5757" : "#4C3FD8"}
        />
      </View>
      <View>
        <Text
          style={[
            styles.settingText,
            { color: isDestructive ? "#FF5757" : "#333" },
          ]}
        >
          {text}
        </Text>
        {subtitle ? (
          <Text style={styles.settingSubText}>{subtitle}</Text>
        ) : null}
      </View>
    </View>
    {hasSwitch ? (
      <Switch
        trackColor={{ false: "#767577", true: "#4C3FD8" }}
        thumbColor={switchValue ? "#fff" : "#f4f3f4"}
        onValueChange={onSwitchChange}
        value={switchValue}
      />
    ) : (
      <Ionicons name="chevron-forward" size={20} color="#C4C4C4" />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  settingLeft: { flexDirection: "row", alignItems: "center" },
  iconContainer: { padding: 8, borderRadius: 10, marginRight: 15 },
  settingText: { fontSize: 16, fontWeight: "500", color: "#333" },
  settingSubText: { fontSize: 12, color: "#888", marginTop: 2 },
});

export default SettingItem;