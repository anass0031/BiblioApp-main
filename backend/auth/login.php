<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

include "../config.php";  // MySQL connection

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$password = trim($data["password"] ?? "");

if (!$email || !$password) {
    echo json_encode([
        "success" => false,
        "message" => "Email et mot de passe obligatoires"
    ]);
    exit;
}

$stmt = $conn->prepare("SELECT id, username, email, password, role, avatar, gender FROM users WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Email introuvable"
    ]);
    exit;
}

$user = $result->fetch_assoc();

if (!password_verify($password, $user["password"])) {
    echo json_encode([
        "success" => false,
        "message" => "Mot de passe incorrect"
    ]);
    exit;
}

unset($user["password"]);

echo json_encode([
    "success" => true,
    "user" => $user
]);
?>
