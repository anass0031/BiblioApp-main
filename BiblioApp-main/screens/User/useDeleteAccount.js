import { useState } from "react";
import { Alert } from "react-native";
import { API_BASE } from "../Admin/adminConfig";

export const useDeleteAccount = (user, setUser) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = () => {
    Alert.alert(
      "Supprimer mon compte",
      "Attention ! Cette action est irréversible. Toutes vos données seront perdues.",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer définitivement",
          style: "destructive", // Affiche le bouton en rouge sur iOS
          onPress: performDelete,
        },
      ]
    );
  };

  const performDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_BASE}/user/delete_account.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert("Adieu", "Votre compte a été supprimé.");
        setUser(null); // Déconnexion immédiate
      } else {
        Alert.alert("Erreur", data.message || "Impossible de supprimer le compte.");
      }
    } catch (error) {
      Alert.alert("Erreur", "Problème de connexion au serveur.");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    confirmDelete, // C'est la fonction qu'on appellera au clic
  };
};