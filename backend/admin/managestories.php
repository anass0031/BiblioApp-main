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
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$user_id = intval($_POST['user_id']);

$res = $conn->query("SELECT role FROM users WHERE id = $user_id");
$user = $res->fetch_assoc();


if (!$user || $user['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(["error" => "Forbidden"]);
    exit;
}
// LIST GENRES
$action = $_POST['action'] ?? $_GET['action'] ?? null;

if ($action === 'get_genres') {
    $res = $conn->query("SELECT id, name FROM genres ORDER BY name ASC");
    $genres = [];
    while ($row = $res->fetch_assoc()) {
        $genres[] = $row;
    }
    echo json_encode($genres);
    exit;
}

if ($action === 'list') {
    $res = $conn->query("
        SELECT s.id, s.title, s.image, s.content, g.name AS genre
        FROM stories s
        LEFT JOIN genres g ON s.genre_id = g.id
        ORDER BY s.id DESC
    ");
    $stories = [];
    while ($row = $res->fetch_assoc()) {
        $stories[] = $row;
    }
    echo json_encode($stories);
    exit;
}

// LIST STORIES
if (isset($_GET['action']) && $_GET['action'] === 'list') {
    $res = $conn->query("
    SELECT s.id, s.title, s.image, s.content, g.name AS genre
    FROM stories s
    LEFT JOIN genres g ON s.genre_id = g.id
    ORDER BY s.id DESC
    ");

    $stories = [];
    while ($row = $res->fetch_assoc()) {
        $stories[] = $row;
    }

    echo json_encode($stories);
    exit;
}

// ADD STORY
if (isset($_POST['action']) && $_POST['action'] === 'add') {
    $title = $conn->real_escape_string($_POST['title']);
    $genre_id = intval($_POST['genre_id']);
    $image = $conn->real_escape_string($_POST['image']);
    $content = $conn->real_escape_string($_POST['content']);

    $conn->query("
        INSERT INTO stories (title, genre_id, image, content)
        VALUES ('$title', $genre_id, '$image', '$content')
    ");

    echo json_encode(["success" => true]);
    exit;
}

// EDIT STORY
if (isset($_POST['action']) && $_POST['action'] === 'edit') {
    $id = intval($_POST['story_id']);
    $title = $conn->real_escape_string($_POST['title']);
    $genre_id = intval($_POST['genre_id']);
    $image = $conn->real_escape_string($_POST['image']);
    $content = $conn->real_escape_string($_POST['content']);

    $conn->query("
        UPDATE stories 
        SET title='$title', genre_id=$genre_id, image='$image', content='$content'
        WHERE id=$id
    ");

    echo json_encode(["success" => true]);
    exit;
}

// DELETE STORY
if (isset($_POST['action']) && $_POST['action'] === 'delete') {
    $id = intval($_POST['story_id']);
    $conn->query("DELETE FROM stories WHERE id=$id");
    echo json_encode(["success" => true]);
    exit;
}

http_response_code(400);
echo json_encode(["error" => "Invalid request"]);
exit;
