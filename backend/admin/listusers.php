<?php
header("Access-Control-Allow-Origin: *"); // allow any origin
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// For OPTIONS preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}
include "../config.php";

if (!isset($_POST['user_id'])) {
    http_response_code(401);
    exit;
}

$user_id = intval($_POST['user_id']);

$res = $conn->query("SELECT role FROM users WHERE id = $user_id");
$user = $res->fetch_assoc();

if (!$user || $user['role'] !== 'admin') {
    http_response_code(403);
    exit;
}

$res = $conn->query("SELECT id, username, email, role FROM users");

$users = [];
while ($row = $res->fetch_assoc()) {
    $users[] = $row;
}

echo json_encode($users);
