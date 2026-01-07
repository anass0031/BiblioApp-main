<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

include "../config.php"; // 🔥 Connexion MySQL centralisée

$id = $_GET["id"] ?? 0;

if (!$id) {
    echo json_encode(["error" => "Missing story ID"]);
    exit;
}

// Requête sécurisée
$stmt = $conn->prepare("SELECT stories.*, genres.name AS genre_name FROM stories LEFT JOIN genres ON stories.genre_id = genres.id WHERE stories.id = ? LIMIT 1");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

$story = $result->fetch_assoc();

echo json_encode($story);
?>