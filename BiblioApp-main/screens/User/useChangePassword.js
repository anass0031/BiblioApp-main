import { useState } from "react";
import { Alert } from "react-native";
import { API_BASE } from "../Admin/adminConfig";

export const useChangePassword = (userId) => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    setIsLoading(true);
    try {
      // APPEL API DIRECT
      const response = await fetch(`${API_BASE}/user/change_password.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setModalVisible(false);
        setCurrentPassword("");
        setNewPassword("");
        Alert.alert("Succès", "Mot de passe modifié avec succès.");
      } else {
        Alert.alert("Erreur", data.message);
      }
    } catch (error) {
      Alert.alert("Erreur", "Problème de connexion au serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    modalVisible,
    setModalVisible,
    currentPassword, setCurrentPassword,
    newPassword, setNewPassword,
    handleChangePassword
  };
};