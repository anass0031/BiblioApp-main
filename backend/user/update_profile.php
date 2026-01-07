<?php
// update_profile.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include '../config.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->id) && isset($data->username) && isset($data->email)) {

    $id = $data->id;
    $username = $data->username;
    $email = $data->email;
    // On récupère le genre, ou "Non précisé" par défaut
    $gender = isset($data->gender) ? $data->gender : 'Non précisé';

    // Vérifier email doublon
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
    $stmt->bind_param("si", $email, $id);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Cet email est déjà utilisé."]);
    } else {
        $stmt->close();

        // Mise à jour AVEC le genre
        $updateStmt = $conn->prepare("UPDATE users SET username = ?, email = ?, gender = ? WHERE id = ?");
        $updateStmt->bind_param("sssi", $username, $email, $gender, $id);

        if ($updateStmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Profil mis à jour.",
                "user" => [
                    "id" => $id,
                    "username" => $username,
                    "email" => $email,
                    "gender" => $gender, // On renvoie le nouveau genre
                    // Garder l'avatar existant s'il n'est pas changé ici
                ]
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Erreur update: " . $conn->error]);
        }
    }
} else {
    echo json_encode(["success" => false, "message" => "Données incomplètes."]);
}
$conn->close();
?>