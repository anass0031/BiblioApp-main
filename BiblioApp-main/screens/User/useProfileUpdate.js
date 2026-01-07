import { useState } from "react";
import { Alert } from "react-native";
import { API_BASE } from "../Admin/adminConfig"; // Vérifie le chemin !

export const useProfileUpdate = (user, setUser) => {
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Champs du formulaire
  const [editName, setEditName] = useState(user.username);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editGender, setEditGender] = useState(user.gender || "Non précisé");

  const handleUpdateProfile = async () => {
    if (!editName || !editEmail) {
      Alert.alert("Erreur", "Veuillez remplir le nom et l'email.");
      return;
    }

    setIsUpdateLoading(true);
    try {
      // APPEL API DIRECT
      const response = await fetch(`${API_BASE}/user/update_profile.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          username: editName,
          email: editEmail,
          gender: editGender,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUser({
          ...user,
          username: data.user.username,
          email: data.user.email,
          gender: data.user.gender,
        });
        setEditModalVisible(false);
        Alert.alert("Succès", "Profil mis à jour !");
      } else {
        Alert.alert("Erreur", data.message);
      }
    } catch (error) {
      Alert.alert("Erreur réseau", "Vérifiez votre connexion.");
    } finally {
      setIsUpdateLoading(false);
    }
  };

  return {
    isUpdateLoading,
    editModalVisible,
    setEditModalVisible,
    editName, setEditName,
    editEmail, setEditEmail,
    editGender, setEditGender,
    handleUpdateProfile
  };
};