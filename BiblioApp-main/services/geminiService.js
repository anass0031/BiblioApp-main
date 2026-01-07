const GEMINI_API_KEY =  "AIzaSyALu9CyNdSm-sfbUs-cXEwRSBPvwmtp53A"; 

export const generateStorySummary = async (storyText) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Rédige un résumé court, captivant et sans spoilers de l'histoire suivante. Adopte un style narratif fluide et n'utilise surtout pas de gras (pas d'astérisques **). Voici l'histoire : ${storyText}`,
                }
              ]
            }
          ]
        }),
      }
    );

    const data = await response.json();
    
    // On vérifie si Gemini a répondu correctement
    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      return "Impossible de générer le résumé pour le moment.";
    }

  } catch (error) {
    console.error("Erreur Gemini:", error);
    throw error;
  }
};

export const generateCreativeContent = async (topic, availableGenres = []) => {
  try {
    const genreList = availableGenres.map(g => g.name).join(", ");
    console.log("Génération de contenu pour le sujet :", topic);
    console.log("Genres disponibles :", genreList);

    const prompt = `Agis en tant qu'écrivain professionnel.
    Raconte une histoire courte sur : "${topic}". 
    COHÉRENCE GLOBALE :
    1. Titre original lié au sujet.
    2. Genre choisi UNIQUEMENT parmi : [${genreList}].
    3. Contenu riche et captivant.
    4. SEARCH_QUERY : L’image doit être liée au sujet et au contenu.
    Réponds EXCLUSIVEMENT sous ce format JSON :
    {
      "title": "Titre de l'histoire",
      "genre_name": "Nom exact du genre choisi (pas toujours le premier ou le même genre)", 
      "image": "lien WEB de l'image relative au sujet verifier que l'image est accessible et valide",
      "content": "Texte de l'histoire"
    }`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      }
    );

    const data = await response.json();

    // Debug : Voir si l'API renvoie une erreur (ex: clé invalide)
    if (data.error) {
      console.error("Erreur API Gemini:", data.error.message);
      return null;
    }

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const rawText = data.candidates[0].content.parts[0].text;
      console.log("Texte brut reçu de Gemini:", rawText);

      // Nettoyage pour extraire le JSON
      const firstBracket = rawText.indexOf('{');
      const lastBracket = rawText.lastIndexOf('}');
      
      if (firstBracket !== -1 && lastBracket !== -1) {
        const jsonString = rawText.substring(firstBracket, lastBracket + 1);
        return JSON.parse(jsonString);
      }
    }
    
    console.warn("Format de réponse inconnu:", data);
    return null;

  } catch (error) {
    console.error("Erreur critique dans generateCreativeContent:", error);
    return null;
  }
};