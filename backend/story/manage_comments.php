<?php
header("Content-Type: application/json");
include '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $story_id = $_GET['story_id'];
    $query = "SELECT comments.*, users.username, users.avatar FROM comments 
              JOIN users ON comments.user_id = users.id 
              WHERE comments.story_id = ? ORDER BY comments.created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $story_id);
    $stmt->execute();
    echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $action = $data['action'] ?? 'add';

    if ($action === 'add') {
        $query = "INSERT INTO comments (story_id, user_id, content) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("iis", $data['story_id'], $data['user_id'], $data['content']);
    } elseif ($action === 'update') {
        $query = "UPDATE comments SET content = ? WHERE id = ? AND user_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("sii", $data['content'], $data['comment_id'], $data['user_id']);
    } elseif ($action === 'delete') {
        $query = "DELETE FROM comments WHERE id = ? AND user_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ii", $data['comment_id'], $data['user_id']);
    }

    echo json_encode(["status" => $stmt->execute() ? "success" : "error"]);
}
