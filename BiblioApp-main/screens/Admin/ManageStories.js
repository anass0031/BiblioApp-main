import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
  Keyboard,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "./adminConfig";
import { Picker } from "@react-native-picker/picker";
import { generateCreativeContent } from "../../services/geminiService";
import { Ionicons } from "@expo/vector-icons"; // Ajouté pour l'icône sparkles

export default function ManageStories() {
  const [stories, setStories] = useState([]);
  const [genres, setGenres] = useState([]);
  const [form, setForm] = useState({
    title: "",
    genre_id: "",
    image: "",
    content: "",
  });
  const [user, setUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false); // Nouvel état pour l'IA

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        if (parsedUser?.id) {
          loadStories(parsedUser.id);
        }
      }
    };

    const loadGenres = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (!storedUser) return;

        const parsedUser = JSON.parse(storedUser);

        const formData = new FormData();
        formData.append("user_id", parsedUser.id);
        formData.append("action", "get_genres");

        const res = await fetch(`${API_BASE}/admin/managestories.php`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        setGenres(data);
      } catch (err) {
        console.error("Error loading genres:", err);
      }
    };

    loadUser();
    loadGenres();
  }, []);

  const loadStories = async (userId) => {
    if (!userId) return;
    try {
      const res = await fetch(
        `${API_BASE}/admin/manageStories.php?action=list`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ user_id: userId }).toString(),
        }
      );
      const data = await res.json();
      setStories(data);
      console.log("Loaded stories:", data);
    } catch (error) {
      console.log("Error loading stories:", error);
    }
  };

  // --- NOUVELLE FONCTION IA ---
  const handleMagicFill = async () => {
    if (!genres || genres.length === 0) {
      Alert.alert("Erreur", "La liste des genres est vide.");
      return;
    }

    Keyboard.dismiss();
    setIsAiLoading(true);

    try {
      // --- ÉTAPE 1 : CHOIX ALÉATOIRE DU GENRE ---
      const randomIndex = Math.floor(Math.random() * genres.length);
      const randomGenre = genres[randomIndex];

      const topic =
        form.title.trim().length > 0
          ? form.title
          : "une histoire intéressante dans le genre " + randomGenre.name;

      // --- ÉTAPE 2 : APPEL IA AVEC LE GENRE IMPOSÉ ---
      const result = await generateCreativeContent(topic, genres);

      if (result) {
        setForm({
          title: result.title,
          genre_id: randomGenre.id.toString(), // On utilise l'ID du genre tiré au sort
          image: result.image,
          content: result.content,
        });
      }
    } catch (e) {
      Alert.alert("Erreur", "Échec de la génération aléatoire.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const submitStory = async () => {
    if (!form.title || !form.genre_id || !form.content) return;

    try {
      const storedUser = await AsyncStorage.getItem("user");
      const user = JSON.parse(storedUser);

      await fetch(`${API_BASE}/admin/manageStories.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          user_id: user.id,
          action: editingId ? "edit" : "add",
          story_id: editingId,
          ...form,
        }).toString(),
      });

      setForm({ title: "", genre_id: "", image: "", content: "" });
      setEditingId(null);
      loadStories(user.id);
    } catch (error) {
      console.log("Error submitting story:", error);
    }
  };

  const startEdit = (story) => {
    console.log("Editing story:", story);
    const genreItem = genres.find((g) => g.name === story.genre);

    setForm({
      title: story.title || "",
      genre_id: genreItem ? genreItem.id.toString() : "",
      image: story.image || "",
      content: story.content || "",
    });
    setEditingId(story.id);
  };

  const deleteStory = async (storyId) => {
    const confirmDelete =
      Platform.OS === "web"
        ? window.confirm("Are you sure you want to delete this story?")
        : await new Promise((resolve) => {
            Alert.alert(
              "Confirm Delete",
              "Are you sure you want to delete this story?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                  onPress: () => resolve(false),
                },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => resolve(true),
                },
              ],
              { cancelable: true }
            );
          });

    if (!confirmDelete) return;

    try {
      const storedUser = await AsyncStorage.getItem("user");
      const user = JSON.parse(storedUser);

      await fetch(`${API_BASE}/admin/manageStories.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          user_id: user.id,
          action: "delete",
          story_id: storyId,
        }).toString(),
      });

      loadStories(user.id);
    } catch (error) {
      console.log("Error deleting story:", error);
    }
  };

  // --- FONCTION : NETTOYER / ANNULER ---
  const handleResetForm = () => {
    setForm({ title: "", genre_id: "", image: "", content: "" });
    setEditingId(null);
    Keyboard.dismiss();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Manage Stories</Text>

      <View style={styles.formCard}>
        <View style={styles.formHeader}>
          <Text style={styles.subtitle}>
            {editingId ? "Edit Story" : "Add Story"}
          </Text>
          {/* Bouton pour vider le formulaire s'il n'est pas vide */}
          {(form.title || form.content || editingId) && (
            <TouchableOpacity onPress={handleResetForm}>
              <Ionicons name="refresh-circle" size={32} color="#FF5C5C" />
            </TouchableOpacity>
          )}
        </View>
        {/* BOUTON IA AJOUTÉ ICI */}
        <TouchableOpacity
          style={[styles.aiButton, isAiLoading && { opacity: 0.7 }]}
          onPress={handleMagicFill}
          disabled={isAiLoading}
        >
          {isAiLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons
                name="sparkles"
                size={18}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.aiButtonText}>Générer tout via l'IA</Text>
            </>
          )}
        </TouchableOpacity>

        <TextInput
          placeholder="Title"
          value={form.title}
          onChangeText={(text) => setForm({ ...form, title: text })}
          style={styles.input}
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.genre_id}
            onValueChange={(itemValue) =>
              setForm({ ...form, genre_id: itemValue })
            }
            style={styles.pickerStyle}
          >
            <Picker.Item label="Select Genre" value="" />
            {Array.isArray(genres) &&
              genres.map((g) => (
                <Picker.Item
                  key={g.id}
                  label={g.name}
                  value={g.id.toString()}
                />
              ))}
          </Picker>
        </View>

        <TextInput
          placeholder="Image URL"
          value={form.image}
          onChangeText={(text) => setForm({ ...form, image: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Content"
          value={form.content}
          onChangeText={(text) => setForm({ ...form, content: text })}
          multiline
          style={[styles.input, { height: 150, textAlignVertical: "top" }]}
        />

        <TouchableOpacity style={styles.submitButton} onPress={submitStory}>
          <Text style={styles.submitButtonText}>
            {editingId ? "Update Story" : "Add Story"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>All Stories</Text>
      <FlatList
        scrollEnabled={false} // Pour fonctionner correctement dans le ScrollView parent
        data={stories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.storyCard}>
            <View style={styles.cardInfo}>
              <Text style={styles.storyTitle}>{item.title}</Text>
              <View style={styles.genreBadge}>
                <Text style={styles.genreText}>{item.genre}</Text>
              </View>
            </View>

            <View style={styles.storyButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => startEdit(item)}
              >
                <Ionicons
                  name="pencil"
                  size={16}
                  color="#fff"
                  style={{ marginRight: 5 }}
                />
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteStory(item.id)}
              >
                <Ionicons
                  name="trash"
                  size={16}
                  color="#fff"
                  style={{ marginRight: 5 }}
                />
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F6FA" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#333" },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 10,
    color: "#555",
  },

  formCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 18,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },
  cancelActionBtn: {
    backgroundColor: "#95a5a6",
    padding: 15,
    borderRadius: 15,
    justifyContent: "center",
  },

  // STYLE IA AJOUTÉ
  aiButton: {
    flexDirection: "row",
    backgroundColor: "#6C5CE7",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  aiButtonText: { color: "#fff", fontWeight: "bold" },

  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    backgroundColor: "#FAFAFA",
  },

  submitButton: {
    backgroundColor: "#4C3FD8",
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
    alignItems: "center",
    shadowColor: "#4C3FD8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  storyCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    marginVertical: 10,
    // Ombre plus douce
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  cardInfo: {
    marginBottom: 15,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 6,
  },
  genreBadge: {
    backgroundColor: "#E0E7FF", // Bleu très clair
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  genreText: {
    color: "#4C3FD8",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  storyButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
    paddingTop: 12,
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: "#6C63FF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    flex: 0.48,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    flexDirection: "row",
    backgroundColor: "#fa3f3fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    flex: 0.48,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  // On ajuste la couleur du texte delete pour le contraste sur fond clair
  deleteButtonText: {
    color: "#FF5C5C",
    fontWeight: "bold",
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 8,
    backgroundColor: "#FAFAFA",
  },
  pickerStyle: {
    height: 50,
    width: "100%",
    color: "#333",
  },
});
