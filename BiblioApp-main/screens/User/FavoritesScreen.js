import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { API_BASE } from "../Admin/adminConfig";

export default function FavoritesScreen({ user, navigation }) {
  const [favorites, setFavorites] = useState([]);

  // URL API
  const URL = API_BASE + "/user/get_user_favorites.php?user_id=" + user.id;

  const fetchFavorites = async () => {
    try {
      const response = await fetch(URL);
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.log("Erreur favoris :", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const removeFavorite = async (story_id) => {
    try {
      const response = await fetch(API_BASE + "/user/remove_favorite.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          story_id: story_id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFavorites((prev) => prev.filter((item) => item.id !== story_id));
      }
    } catch (error) {
      console.log("Erreur suppression favori :", error);
    }
  };

  // État vide stylisé
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="heart-dislike-outline" size={40} color="#4C3FD8" />
      </View>
      <Text style={styles.emptyTitle}>No favorites yet</Text>
      <Text style={styles.emptySubtitle}>
        Stories you love will appear in your Favorite List.
      </Text>
      <TouchableOpacity 
        style={styles.browseButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.browseButtonText}>Browse Stories</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* --- NOUVEAU HEADER DESIGN PRO --- */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.headerSubtitle}>YOUR COLLECTION</Text>
          <View style={styles.titleRow}>
            <Text style={styles.headerTitle}>Favorites</Text>
            <Text style={styles.headerDot}>.</Text>
          </View>
        </View>

        {/* Badge Circulaire Moderne */}
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{favorites.length}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {favorites.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate("StoryDetail", { id: item.id })}
                style={styles.itemContainer}
              >
                {/* Image miniature format livre */}
                <Image source={{ uri: item.image }} style={styles.bookCover} />

                {/* Info Text */}
                <View style={styles.textInfo}>
                  <View style={styles.genreTag}>
                    <Text style={styles.genreText}>{item.genre_name}</Text>
                  </View>
                  <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.readLink}>Read now ➝</Text>
                </View>

                {/* Bouton Supprimer vertical */}
                <TouchableOpacity
                  style={styles.deleteAction}
                  onPress={() => removeFavorite(item.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF4757" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  
  // --- NOUVEAUX STYLES HEADER ---
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end", // Aligne le badge avec le bas du titre
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 25,
    backgroundColor: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "700",
    letterSpacing: 1.5, // Espacement des lettres "Pro"
    marginBottom: 4,
    textTransform: "uppercase",
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "900", // Extra Bold
    color: "#111827",
    letterSpacing: -1, // Resserre un peu les lettres pour l'impact
  },
  headerDot: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#4C3FD8", // Le point violet
    lineHeight: 40,
  },
  headerBadge: {
    backgroundColor: "#EEF2FF",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5, // Ajustement vertical
  },
  headerBadgeText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#4C3FD8",
  },

  // --- RESTE DES STYLES ---
  content: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
  },
  listContent: {
    padding: 24,
    paddingTop: 30,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  bookCover: {
    width: 70,
    height: 100,
    borderRadius: 10,
    backgroundColor: "#E0E0E0",
  },
  textInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
    height: 100,
  },
  genreTag: {
    alignSelf: 'flex-start',
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  genreText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#4C3FD8",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 8,
    lineHeight: 22,
  },
  readLink: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4C3FD8",
  },
  deleteAction: {
    padding: 10,
    marginLeft: 5,
    backgroundColor: "#FFF5F6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: "#1F2937",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  browseButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
});