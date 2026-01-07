<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// For OPTIONS preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include "../config.php"; 
require_once "../config.php";

if (!isset($_POST['user_id'])) {
    http_response_code(401);
    exit;
}

$user_id = intval($_POST['user_id']);

// check role
$check = $conn->query("SELECT role FROM users WHERE id = $user_id");
$user = $check->fetch_assoc();

if (!$user || $user['role'] !== 'admin') {
    http_response_code(403);
    exit;
}

// Total Users
$totalUsers = $conn->query("SELECT COUNT(*) AS total FROM users")
                   ->fetch_assoc()['total'];

// Total Stories
$totalStories = $conn->query("SELECT COUNT(*) AS total FROM stories")
                     ->fetch_assoc()['total'];

// Total Favorites
$totalFavorites = $conn->query("SELECT COUNT(*) AS total FROM favorites")
                       ->fetch_assoc()['total'];

// Top Stories (by favorites)
$topStoriesRes = $conn->query("
    SELECT s.id, s.title, COUNT(f.id) AS fav_count
    FROM stories s
    LEFT JOIN favorites f ON s.id = f.story_id
    GROUP BY s.id
    ORDER BY fav_count DESC
    LIMIT 5
");

$topStories = [];
while ($row = $topStoriesRes->fetch_assoc()) {
    $topStories[] = $row;
}

echo json_encode([
    "totalUsers" => $totalUsers,
    "totalStories" => $totalStories,
    "totalFavorites" => $totalFavorites,
    "topStories" => $topStories
]);
