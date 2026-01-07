<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

include "../config.php";

// 🔥 récupérer user_id si envoyé
$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

// 🔥 charger tous les favoris du user (si connecté)
$fav_ids = [];

if ($user_id > 0) {
    $fav_sql = "SELECT story_id FROM favorites WHERE user_id = $user_id";
    $fav_res = $conn->query($fav_sql);

    while ($fav = $fav_res->fetch_assoc()) {
        $fav_ids[] = intval($fav["story_id"]);
    }
}

$sql = "
SELECT 
    stories.*, 
    genres.name AS genre_name
FROM stories
JOIN genres ON genres.id = stories.genre_id
";

$result = $conn->query($sql);

$stories = [];

while ($row = $result->fetch_assoc()) {
    // 🔥 ajouter si favori ou non
    $row["is_favorite"] = in_array(intval($row["id"]), $fav_ids);

    $stories[] = $row;
}

echo json_encode($stories);
