import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  StatusBar,
  Dimensions,
  Platform,
  Alert,
  Modal
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Pour les icônes des boutons
import * as Print from 'expo-print'; // Pour le PDF
import * as Sharing from 'expo-sharing'; // Pour partager le PDF

import { API_BASE } from "./Admin/adminConfig";
import { generateStorySummary } from "../services/geminiService"; // Ton service IA

// On récupère la hauteur de l'écran pour dimensionner l'image
const { height } = Dimensions.get('window');

export default function StoryDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [story, setStory] = useState(null);

  // --- NOUVEAUX ÉTATS (AI & PDF) ---
  const [modalVisible, setModalVisible] = useState(false);
  const [summary, setSummary] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const API_URL = `${API_BASE}/story/get_story.php?id=${id}`;

  useEffect(() => {
    fetchStory();
  }, []);

  const fetchStory = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setStory(data);
    } catch (error) {
      console.log("Error fetching story:", error);
    }
  };

  // --- 1. FONCTION : GÉNÉRER RÉSUMÉ (IA) ---
  const handleGenerateSummary = async () => {
    setModalVisible(true);
    if (summary) return; // Si déjà généré, on ne recharge pas

    setIsAiLoading(true);
    try {
      // On envoie le texte à Gemini
      const result = await generateStorySummary(`Titre: ${story.title}. Contenu: ${story.content}`);
      setSummary(result);
    } catch (error) {
      setSummary("Erreur de connexion avec l'IA.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // --- 2. FONCTION : TÉLÉCHARGER PDF ---
  const handleDownloadStory = async () => {
    try {
      const htmlContent = `
        <html>
          <head>
            <style>
              @page { margin: 50px; }
              body { 
                font-family: 'Georgia', 'Times New Roman', serif; 
                color: #2c3e50; 
                line-height: 1.8; 
                padding: 20px;
              }
              .header {
                text-align: center;
                margin-bottom: 40px;
                border-bottom: 2px solid #4C3FD8;
                padding-bottom: 20px;
              }
              h1 { 
                font-size: 32px; 
                color: #1a1a1a; 
                margin-bottom: 10px; 
                text-transform: capitalize;
              }
              .genre { 
                font-family: 'Helvetica', sans-serif;
                color: #4C3FD8; 
                font-size: 12px; 
                text-transform: uppercase; 
                letter-spacing: 2px; 
                font-weight: bold;
              }
              .content {
                font-size: 14pt; 
                text-align: justify; 
                margin-top: 30px;
              }
              /* Lettrine (Première lettre plus grande) */
              .content::first-letter {
                font-size: 300%;
                color: #4C3FD8;
                float: left;
                line-height: 0.8;
                margin-right: 8px;
                font-weight: bold;
              }
              footer {
                margin-top: 60px; 
                text-align: center; 
                color: #bdc3c7; 
                font-size: 10px; 
                font-family: sans-serif;
                border-top: 1px solid #eee;
                padding-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="genre">${story.genre || "HISTOIRE"}</div>
              <h1>${story.title}</h1>
            </div>
            
            <div class="content">
              ${story.content.replace(/\n/g, "<br /><br />")}
            </div>

            <footer>
              Document généré par l'application BiblioApp • Tous droits réservés
            </footer>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      Alert.alert("Erreur", "Impossible de générer le PDF.");
    }
  };

  if (!story) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4C3FD8" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Image Hero en haut */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: story.image }} style={styles.image} resizeMode="cover" />
          {/* Un overlay noir transparent pour que le bouton retour soit visible */}
          <View style={styles.imageOverlay} />
        </View>

        {/* Contenu de l'histoire */}
        <View style={styles.contentContainer}>
          
          {/* Ligne du Genre (Badge) */}
          <View style={styles.genreWrapper}>
  {/* Genre à Gauche */}
  <View style={styles.genreBadge}>
    <Text style={styles.genreText}>
      {story.genre_name ? story.genre_name.toUpperCase() : "HISTOIRE"}
    </Text>
  </View>

  {/* Lien Commentaires à Droite */}
  <TouchableOpacity 
    style={styles.commentCircleButton} 
    onPress={() => navigation.navigate("Comments", { storyId: story.id, storyTitle: story.title })}
  >
    <Ionicons name="chatbubble-ellipses-outline" size={20} color="#4C3FD8" />
  </TouchableOpacity>
</View>

          <Text style={styles.title}>{story.title}</Text>
          
          {/* Séparateur décoratif */}
          <View style={styles.divider} />

          {/* --- NOUVEAU : BOUTONS ACTIONS (IA & PDF) --- */}
          <View style={styles.actionButtonsContainer}>
            {/* Bouton IA */}
            <TouchableOpacity style={styles.aiButton} onPress={handleGenerateSummary}>
              <Ionicons name="sparkles" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.aiButtonText}>Résumé IA</Text>
            </TouchableOpacity>

            {/* Bouton PDF */}
            <TouchableOpacity style={styles.pdfButton} onPress={handleDownloadStory}>
              <Ionicons name="share-outline" size={18} color="#4C3FD8" style={{ marginRight: 8 }} />
              <Text style={styles.pdfButtonText}>PDF</Text>
            </TouchableOpacity>
          </View>
          {/* Bouton Commentaires */}
          {/* ------------------------------------------- */}

          <Text style={styles.content}>{story.content}</Text>
        </View>
      </ScrollView>

      {/* Bouton Retour Flottant */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      {/* --- NOUVEAU : MODAL POUR L'IA --- */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>✨ Résumé Gemini</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {isAiLoading ? (
              <View style={styles.modalLoading}>
                <ActivityIndicator size="large" color="#4C3FD8" />
                <Text style={{ marginTop: 10, color: "#666" }}>Analyse en cours...</Text>
              </View>
            ) : (
              <ScrollView style={{ maxHeight: 300 }}>
                <Text style={styles.summaryText}>{summary}</Text>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  imageContainer: {
    height: height * 0.45,
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  
  contentContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -40,
    paddingHorizontal: 25,
    paddingTop: 30,
    minHeight: height * 0.6,
  },
  
  // --- MISE À JOUR : GENRE À GAUCHE, COMMENTAIRE À DROITE ---
  genreWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Écarte le badge et le bouton
    alignItems: 'center', // Aligne verticalement
    marginBottom: 20,
    width: '100%',
  },
  genreBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  genreText: {
    color: "#4C3FD8",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  commentCircleButton: {
    width: 44,
    height: 44,
    borderRadius: 22, // Forme parfaitement circulaire
    backgroundColor: "#F0EFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#4C3FD8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  // ---------------------------------------------------------

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  divider: {
    height: 4,
    width: 40,
    backgroundColor: "#F2F2F2",
    marginBottom: 20,
    borderRadius: 2,
  },

  actionButtonsContainer: {
    flexDirection: "row",
    marginBottom: 25,
    gap: 15,
  },
  aiButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#4C3FD8",
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#4C3FD8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  aiButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  
  pdfButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#4C3FD8",
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  pdfButtonText: { color: "#4C3FD8", fontWeight: "bold", fontSize: 14 },

  content: {
    fontSize: 17,
    lineHeight: 28,
    color: "#4A4A4A",
    textAlign: "justify",
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  backButtonText: {
    fontSize: 24,
    color: "#000",
    marginTop: -2,
    fontWeight: 'bold',
  },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 20 },
  modalContent: { backgroundColor: "#fff", borderRadius: 20, padding: 20, elevation: 5 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#4C3FD8" },
  modalLoading: { alignItems: "center", padding: 20 },
  summaryText: { fontSize: 16, lineHeight: 24, color: "#333" },
});