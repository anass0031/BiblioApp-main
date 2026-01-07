<?php
// delete_account.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include '../config.php'; // Vérifie ton chemin vers la BDD

$data = json_decode(file_get_contents("php://input"));

if (isset($data->id)) {
    $id = $data->id;

    // Suppression de l'utilisateur
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Compte supprimé avec succès."]);
    } else {
        echo json_encode(["success" => false, "message" => "Erreur lors de la suppression."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "ID utilisateur manquant."]);
}
