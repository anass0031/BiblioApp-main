<?php
// change_password.php
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include '../config.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->id) && isset($data->currentPassword) && isset($data->newPassword)) {

    $id = $data->id;
    $currentPassword = $data->currentPassword;
    $newPassword = $data->newPassword;

    // 1. Récupérer le hash actuel
    $stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
    $stmt->bind_param("i", $id); // "i" pour integer
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        $hashed_password_db = $row['password'];

        // 2. Vérifier l'ancien mot de passe
        if (password_verify($currentPassword, $hashed_password_db)) {

            // 3. Hasher le nouveau mot de passe
            $new_hashed_password = password_hash($newPassword, PASSWORD_DEFAULT);
            $stmt->close();

            // 4. Mettre à jour
            $updateStmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
            $updateStmt->bind_param("si", $new_hashed_password, $id); // "s" (string), "i" (int)

            if ($updateStmt->execute()) {
                echo json_encode(["success" => true, "message" => "Mot de passe modifié avec succès."]);
            } else {
                echo json_encode(["success" => false, "message" => "Erreur lors de la mise à jour."]);
            }
            $updateStmt->close();
        } else {
            echo json_encode(["success" => false, "message" => "L'ancien mot de passe est incorrect."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Utilisateur introuvable."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Données incomplètes."]);
}

$conn->close();
