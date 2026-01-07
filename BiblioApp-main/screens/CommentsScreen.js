import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Keyboard,
  Image,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE } from "./Admin/adminConfig";

export default function CommentsScreen({ route }) {
  const { storyId, storyTitle } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);

  // États pour la Modal d'image
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const flatListRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) setCurrentUser(JSON.parse(storedUser));
      fetchComments();
    };
    loadData();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/story/manage_comments.php?story_id=${storyId}`
      );
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Erreur fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  const openImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const handleSendOrUpdate = async () => {
    if (!newComment.trim()) return;
    const action = editingCommentId ? "update" : "add";

    try {
      await fetch(`${API_BASE}/story/manage_comments.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          comment_id: editingCommentId,
          story_id: storyId,
          user_id: currentUser.id,
          content: newComment,
        }),
      });

      setNewComment("");
      setEditingCommentId(null);
      Keyboard.dismiss();
      fetchComments();
    } catch (error) {
      Alert.alert("Erreur", "Action impossible");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = (commentId) => {
    Alert.alert("Supprimer", "Confirmer la suppression ?", [
      { text: "Non" },
      {
        text: "Oui",
        style: "destructive",
        onPress: () => confirmAction("delete", commentId),
      },
    ]);
  };

  const confirmAction = async (action, commentId) => {
    await fetch(`${API_BASE}/story/manage_comments.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        comment_id: commentId,
        user_id: currentUser.id,
      }),
    });
    fetchComments();
  };

  return (
    <SafeAreaView style={styles.mainSafeContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 90}
        style={styles.container}
      >
        <View style={styles.headerPane}>
          <Text style={styles.headerTitle}>Commentaires</Text>
          <Text style={styles.headerSubtitle}>{storyTitle}</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4C3FD8" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            ref={flatListRef}
            data={comments}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.commentRow}>
                <View style={styles.commentHeader}>
                  <View style={styles.userSection}>
                    {/* AVATAR CLIQUABLE */}
                    <TouchableOpacity 
                      style={styles.avatar}
                      onPress={() => item.avatar && openImage(`${API_BASE}/user/uploads/${item.avatar}`)}
                      disabled={!item.avatar}
                    >
                      {item.avatar ? (
                        <Image
                          source={{ uri: `${API_BASE}/user/uploads/${item.avatar}` }}
                          style={styles.avatarImage}
                        />
                      ) : (
                        <Text style={styles.avatarText}>
                          {item.username ? item.username.charAt(0).toUpperCase() : "?"}
                        </Text>
                      )}
                    </TouchableOpacity>

                    <View>
                      <Text style={styles.username}>{item.username}</Text>
                      <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
                    </View>
                  </View>

                  {currentUser && currentUser.id == item.user_id && (
                    <View style={styles.actionIcons}>
                      <TouchableOpacity
                        onPress={() => {
                          setEditingCommentId(item.id);
                          setNewComment(item.content);
                        }}
                      >
                        <Ionicons name="pencil" size={16} color="#4C3FD8" style={{ marginRight: 15 }} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(item.id)}>
                        <Ionicons name="trash" size={16} color="#FF5C5C" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <Text style={styles.commentText}>{item.content}</Text>
                <View style={styles.separator} />
              </View>
            )}
          />
        )}

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Écrire un commentaire..."
              placeholderTextColor="#999"
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity onPress={handleSendOrUpdate} style={styles.sendBtn}>
              <Ionicons name={editingCommentId ? "checkmark" : "send"} size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* MODAL POUR L'IMAGE EN GRAND */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity 
            style={styles.closeModalBtn} 
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close-circle" size={40} color="#fff" />
          </TouchableOpacity>
          
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
  mainSafeContainer: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  headerPane: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "#4C3FD8" },
  headerSubtitle: { fontSize: 14, color: "#666" },
  listContent: { padding: 20, paddingBottom: 20 },
  commentRow: { marginBottom: 20, width: "100%" },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  userSection: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 46, // Plus grand (était 34)
    height: 46, // Plus grand (était 34)
    borderRadius: 23,
    backgroundColor: "#4C3FD8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  avatarImage: { width: "100%", height: "100%", resizeMode: "cover" },
  avatarText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  username: { fontWeight: "700", color: "#333", fontSize: 15 },
  dateText: { fontSize: 11, color: "#999" },
  actionIcons: { flexDirection: "row" },
  commentText: { color: "#444", fontSize: 15, lineHeight: 22, paddingLeft: 58 },
  separator: {
    height: 1,
    backgroundColor: "#F5F5F5",
    marginTop: 15,
    width: "80%",
    alignSelf: "flex-end",
  },
  inputWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "android" ? 5 : 8,
  },
  input: { flex: 1, fontSize: 15, color: "#333", maxHeight: 100 },
  sendBtn: {
    backgroundColor: "#4C3FD8",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  // Styles Modal
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: { width: "95%", height: "80%" },
  closeModalBtn: {
    position: "absolute",
    top: 50,
    right: 25,
    zIndex: 10,
  },
});