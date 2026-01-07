<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");

include "../config.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data["user_id"] ?? null;
$story_id = $data["story_id"] ?? null;

if (!$user_id || !$story_id) {
    echo json_encode(["success" => false, "message" => "Missing parameters"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM favorites WHERE user_id = ? AND story_id = ?");
$stmt->bind_param("ii", $user_id, $story_id);
$stmt->execute();

echo json_encode(["success" => true]);
?>