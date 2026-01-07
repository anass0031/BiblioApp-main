import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { API_BASE } from "./Admin/adminConfig";
const UPLOADS_URL = `${API_BASE}/user/uploads/`;

export default function HomeScreen({ user, navigation }) {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [genresList, setGenresList] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");

  const STORIES_URL = API_BASE + "/story/get_stories.php?user_id=" + user.id;
  const GENRES_URL = API_BASE + "/story/get_genres.php";
  const ADD_FAV_URL = API_BASE + "/user/add_favorite.php";
  const REMOVE_FAV_URL = API_BASE + "/user/remove_favorite.php";

  useEffect(() => {
    fetchStories();
    fetchGenres();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchStories();
    }, [])
  );

  const fetchStories = async () => {
    try {
      const response = await fetch(STORIES_URL);
      const data = await response.json();
      setStories(data);
      setFilteredStories(data);
    } catch (error) {
      console.log("Erreur stories :", error);
    }
  };

  const fetchGenres = async () => {
    try {
      const res = await fetch(GENRES_URL);
      const data = await res.json();
      setGenresList([{ id: 0, name: "All" }, ...data]);
    } catch (error) {
      console.log("Erreur genres :", error);
    }
  };

  const toggleFavorite = async (storyId, isFav) => {
    try {
      const URL = isFav ? REMOVE_FAV_URL : ADD_FAV_URL;

      await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, story_id: storyId }),
      });

      fetchStories();
    } catch (error) {
      console.log("Erreur toggle:", error);
    }
  };

  useEffect(() => {
    let result = stories;
    if (genre !== "All") result = result.filter((s) => s.genre_id == genre);
    if (search.trim() !== "")
      result = result.filter((s) =>
        s.title.toLowerCase().includes(search.toLowerCase())
      );
    setFilteredStories(result);
  }, [search, genre, stories]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <View style={styles.mainContent}>
        {/* HEADER & SEARCH SECTION */}
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.welcomeLabel}>Hello,</Text>
              <Text style={styles.usernameText}>{user.username} 👋</Text>
            </View>
            {/* Avatar Réel */}
            <Image
              source={
                user.avatar
                  ? {
                      uri: `${UPLOADS_URL}${
                        user.avatar
                      }?t=${new Date().getTime()}`,
                    }
                  : require("../assets/profile.png") // Ton image par défaut locale
              }
              style={styles.avatarImage} // On change le style
            />
          </View>

          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              placeholder="Discover new stories..."
              placeholderTextColor="#999"
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* GENRES (Horizontal Scroll) */}
        <View style={styles.genresSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.genresScrollContent}
          >
            {genresList.map((g) => {
              const active =
                genre === g.id || (genre === "All" && g.name === "All");
              return (
                <TouchableOpacity
                  key={g.id}
                  onPress={() => setGenre(g.name === "All" ? "All" : g.id)}
                  style={[styles.genrePill, active && styles.genrePillActive]}
                >
                  <Text
                    style={[styles.genreText, active && styles.genreTextActive]}
                  >
                    {g.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* STORY LIST */}
        <FlatList
          data={filteredStories}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const isFav = item.is_favorite == 1;

            return (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate("StoryDetail", { id: item.id })
                }
                style={styles.card}
              >
                {/* Image Section */}
                <View style={styles.cardImageContainer}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.cardImage}
                  />
                  <View style={styles.cardOverlayGradient} />

                  {/* Genre Badge on Image */}
                  <View style={styles.cardGenreBadge}>
                    <Text style={styles.cardGenreText}>{item.genre_name}</Text>
                  </View>

                  {/* Favorite Button Floating */}
                  <TouchableOpacity
                    onPress={() => toggleFavorite(item.id, isFav)}
                    style={styles.floatingFavButton}
                  >
                    <Text style={{ fontSize: 18 }}>{isFav ? "❤️" : "🤍"}</Text>
                  </TouchableOpacity>
                </View>

                {/* Content Section */}
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.title}
                  </Text>

                  <View style={styles.cardFooter}>
                    <Text style={styles.readMoreText}>Read Story ➝</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

// --- NOUVEAU DESIGN (STYLES) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA", // Gris très clair moderne
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  mainContent: {
    flex: 1,
  },

  // Header Styles
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#F8F9FA",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeLabel: {
    fontSize: 16,
    color: "#8898AA",
    fontWeight: "500",
  },
  usernameText: {
    fontSize: 26,
    color: "#1A1B1E", // Noir doux
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  avatarPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#E0E7FF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#eee",
  },

  // Search Styles
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F1F3F5",
  },
  searchIcon: {
    marginRight: 10,
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1A1B1E",
    height: "100%",
  },

  // Genres Styles
  genresSection: {
    marginVertical: 15,
  },
  genresScrollContent: {
    paddingHorizontal: 24,
  },
  genrePill: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  genrePillActive: {
    backgroundColor: "#4C3FD8", // Couleur primaire
    borderColor: "#4C3FD8",
  },
  genreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8898AA",
  },
  genreTextActive: {
    color: "#FFFFFF",
  },

  // List & Card Styles
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
    overflow: "visible", // Important pour l'ombre sur iOS
  },
  cardImageContainer: {
    height: 200,
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardOverlayGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)", // Légère teinte pour contraste
  },

  // Badge Genre sur l'image
  cardGenreBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cardGenreText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4C3FD8",
    textTransform: "uppercase",
  },

  // Bouton Favoris Flottant
  floatingFavButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.3)", // Fond semi-transparent sombre
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  // Contenu Carte
  cardContent: {
    padding: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2D3748",
    marginBottom: 12,
    lineHeight: 28,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  readMoreText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#4C3FD8",
  },
});
