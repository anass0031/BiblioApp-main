<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "../config.php";

$user_id = $_GET["user_id"] ?? null;

if (!$user_id) {
    echo json_encode([]);
    exit;
}

$sql = "SELECT s.id, s.title, s.image, s.content, g.name AS genre_name
        FROM favorites f
        JOIN stories s ON f.story_id = s.id
        JOIN genres g ON s.genre_id = g.id
        WHERE f.user_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$favorites = [];

while ($row = $result->fetch_assoc()) {
    $favorites[] = $row;
}

echo json_encode($favorites);
?>
