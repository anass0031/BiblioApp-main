<?php
// upload_avatar.php

// 1. SÉCURITÉ : On cache les warnings HTML pour ne pas casser l'app Mobile
error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include '../config.php'; // Vérifie que ce chemin vers config.php est bon !

// 2. SÉCURITÉ : On crée le dossier uploads s'il n'existe pas
$targetDir = "uploads/";
if (!is_dir($targetDir)) {
    if (!mkdir($targetDir, 0777, true)) {
        echo json_encode(["success" => false, "message" => "Impossible de créer le dossier uploads sur le serveur."]);
        exit();
    }
}

// Vérifier si un fichier a été envoyé
if (isset($_FILES['image']) && isset($_POST['id'])) {
    $id = $_POST['id'];
    $image = $_FILES['image'];

    // Nettoyage du nom de fichier et Ajout d'un timestamp pour éviter le cache
    $filename = basename($image['name']);
    $imageName = time() . '_' . $filename;
    $targetFilePath = $targetDir . $imageName;

    // 3. Déplacer l'image
    if (move_uploaded_file($image['tmp_name'], $targetFilePath)) {

        // Mise à jour BDD
        $stmt = $conn->prepare("UPDATE users SET avatar = ? WHERE id = ?");
        $stmt->bind_param("si", $imageName, $id);

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Photo de profil mise à jour.",
                "avatar" => $imageName
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Erreur SQL : " . $conn->error]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Erreur lors de l'écriture du fichier."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Aucune image reçue."]);
}
