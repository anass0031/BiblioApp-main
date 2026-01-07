import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Modal,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { API_BASE } from "../Admin/adminConfig";

import PasswordInput from "../../components/PasswordInput";
import SettingItem from "../../components/SettingItem";
import CustomModal from "../../components/CustomModal";

import { useAvatar } from "./useAvatar";
import { useProfileUpdate } from "./useProfileUpdate";
import { useChangePassword } from "./useChangePassword";
import { useDeleteAccount } from "./useDeleteAccount";

const UPLOADS_URL = `${API_BASE}/user/uploads/`;

export default function ProfileScreen({ user, setUser }) {
  // 1. Hook Avatar
  const { pickImage, isAvatarLoading } = useAvatar(user, setUser);

  // 2. Hook Update Profil
  const {
    isUpdateLoading,
    editModalVisible,
    setEditModalVisible,
    editName,
    setEditName,
    editEmail,
    setEditEmail,
    editGender,
    setEditGender,
    handleUpdateProfile,
  } = useProfileUpdate(user, setUser);

  // 3. Hook Change Password
  const {
    isLoading: isPwdLoading,
    modalVisible: passwordModalVisible,
    setModalVisible: setPasswordModalVisible,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    handleChangePassword,
  } = useChangePassword(user.id);

  // ... après le hook de changement de mot de passe

  const { confirmDelete, isDeleting } = useDeleteAccount(user, setUser);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4C3FD8" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <View style={styles.profileHeader}>
            <View style={styles.imageWrapper}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  // Détermine l'URL (soit l'avatar utilisateur, soit l'image par défaut)
                  const imageToOpen = user.avatar
                    ? `${UPLOADS_URL}${user.avatar}?t=${new Date().getTime()}`
                    : null;

                  if (imageToOpen) {
                    openImage(imageToOpen);
                  } else {
                    // Optionnel : Message si c'est l'image par défaut
                    Alert.alert("Info", "Aucune photo de profil à agrandir");
                  }
                }}
              >
                <Image
                  source={
                    user.avatar
                      ? {
                          uri: `${UPLOADS_URL}${
                            user.avatar
                          }?t=${new Date().getTime()}`,
                        }
                      : require("../../assets/profile.png")
                  }
                  style={styles.profileImage}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editBadge}
                onPress={pickImage}
                disabled={isAvatarLoading}
              >
                {isAvatarLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="camera" size={14} color="#fff" />
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.genderText}>
              {user.gender || "Genre non défini"}
            </Text>

            <TouchableOpacity
              style={styles.editProfileBtn}
              onPress={() => setEditModalVisible(true)}
            >
              <Text style={styles.editProfileText}>Éditer le profil</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION COMPTE */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Compte</Text>
          <View style={styles.sectionCard}>
            <SettingItem
              icon="person-outline"
              text="Informations personnelles"
              subtitle={user.email}
              onPress={() => setEditModalVisible(true)}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="lock-closed-outline"
              text="Changer mot de passe"
              onPress={() => setPasswordModalVisible(true)}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="trash-outline"
              text={
                isDeleting ? "Suppression en cours..." : "Supprimer mon compte"
              }
              isDestructive={true}
              onPress={confirmDelete} // On appelle la fonction de confirmation du hook
              disabled={isDeleting}
            />
          </View>
        </View>

        {/* LOGOUT */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            onPress={() => setUser(null)}
            style={styles.logoutButton}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#FF5757"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* --- MODAL 1: ÉDITER PROFIL --- */}
      <CustomModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        title="Modifier le profil"
        onSave={handleUpdateProfile}
        isLoading={isUpdateLoading}
      >
        <Text style={styles.label}>Nom d'utilisateur</Text>
        <TextInput
          style={styles.input}
          value={editName}
          onChangeText={setEditName}
          placeholder="Votre nom"
        />

        <Text style={styles.label}>Adresse Email</Text>
        <TextInput
          style={styles.input}
          value={editEmail}
          onChangeText={setEditEmail}
          placeholder="Votre email"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Genre</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={editGender}
            onValueChange={(itemValue) => setEditGender(itemValue)}
            style={styles.picker}
          >
            <Picker.Item
              label="Non précisé"
              value="Non précisé"
              style={styles.pickerItem}
            />
            <Picker.Item
              label="Homme"
              value="Homme"
              style={styles.pickerItem}
            />
            <Picker.Item
              label="Femme"
              value="Femme"
              style={styles.pickerItem}
            />
          </Picker>
        </View>
      </CustomModal>

      {/* --- MODAL 2: MOT DE PASSE --- */}
      <CustomModal
        visible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
        title="Sécurité"
        onSave={handleChangePassword}
        isLoading={isPwdLoading}
      >
        <Text style={styles.label}>Mot de passe actuel</Text>
        <PasswordInput
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="********"
        />

        <Text style={styles.label}>Nouveau mot de passe</Text>
        <PasswordInput
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="********"
        />
      </CustomModal>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade" // Apparition en douceur
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          {/* Bouton pour fermer la modal */}
          <TouchableOpacity
            style={styles.closeModalBtn}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close-circle" size={45} color="#fff" />
          </TouchableOpacity>

          {/* Affichage de l'image sélectionnée */}
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  scrollContent: { paddingBottom: 40 },
  headerContainer: {
    backgroundColor: "#fff",
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 3,
  },
  profileHeader: { alignItems: "center", marginTop: 20 },
  imageWrapper: { position: "relative" },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#4C3FD8",
    backgroundColor: "#eee",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4C3FD8",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  username: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 15,
  },
  genderText: {
    fontSize: 14,
    color: "#4C3FD8",
    fontWeight: "600",
    marginTop: 2,
  },
  editProfileBtn: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: "#F0F0FA",
  },
  editProfileText: { color: "#4C3FD8", fontWeight: "600", fontSize: 14 },
  sectionContainer: { marginTop: 25, marginHorizontal: 20 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#888",
    marginBottom: 10,
    marginLeft: 10,
    textTransform: "uppercase",
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 5,
    elevation: 2,
  },
  divider: { height: 1, backgroundColor: "#F0F0F0", marginLeft: 55 },
  logoutContainer: { marginTop: 30, alignItems: "center" },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FFEBEE",
  },
  logoutText: { color: "#FF5757", fontWeight: "600", fontSize: 16 },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    marginTop: 10,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  pickerContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEE",
    overflow: "hidden",
  },
  picker: { height: 55, width: "100%" },
  pickerItem: { fontSize: 16, color: "#333" },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)", // Fond noir très opaque
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "95%",
    height: "80%",
  },
  closeModalBtn: {
    position: "absolute",
    top: 50,
    right: 30,
    zIndex: 10,
  },
  imageWrapper: {
    position: "relative", // Nécessaire pour positionner le badge caméra par-dessus
  },
});
