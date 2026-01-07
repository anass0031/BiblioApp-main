import { useState } from "react";
import { Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { API_BASE } from "../Admin/adminConfig"; // Vérifie le chemin !

export const useAvatar = (user, setUser) => {
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Refusé", "Permission requise pour les photos");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Erreur Picker:", error);
    }
  };

  const uploadImage = async (imageUri) => {
    setIsAvatarLoading(true);

    let filename = imageUri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image/jpeg`;

    let formData = new FormData();
    formData.append("id", String(user.id));
    formData.append("image", {
      uri: Platform.OS === "android" ? imageUri : imageUri.replace("file://", ""),
      name: filename,
      type: type,
    });

    try {
      // APPEL API DIRECT
      const response = await fetch(`${API_BASE}/user/upload_avatar.php`, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" },
      });

      const textData = await response.text();
      try {
        const data = JSON.parse(textData);
        if (data.success) {
          setUser({ ...user, avatar: data.avatar });
          Alert.alert("Succès", "Photo mise à jour !");
        } else {
          Alert.alert("Erreur", data.message);
        }
      } catch (e) {
        console.log("Erreur Parse JSON:", e);
        Alert.alert("Erreur", "Réponse serveur invalide.");
      }
    } catch (error) {
      Alert.alert("Erreur Réseau", "Impossible de joindre le serveur.");
    } finally {
      setIsAvatarLoading(false);
    }
  };

  return {
    pickImage,
    isAvatarLoading
  };
};