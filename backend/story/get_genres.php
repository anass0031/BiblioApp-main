<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

include "../config.php";  // 🔥 utilisation du fichier config

$sql = "SELECT * FROM genres ORDER BY name ASC";
$result = $conn->query($sql);

$genres = [];

while ($row = $result->fetch_assoc()) {
    $genres[] = $row;
}

echo json_encode($genres);
?>
