<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';

$type = isset($_GET['type']) ? trim($_GET['type']) : 'gallery';
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 500;

try {
    $conn = OpenCon();
    if (!$conn) {
        throw new Exception("Database connection unavailable");
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $conn->prepare("
            SELECT id, type, title, subtitle, body, image_url, category, published_at, is_visible, display_order, fields, created_at, updated_at
            FROM admin_content
            WHERE type = :type
            ORDER BY display_order ASC, created_at DESC
            LIMIT :limit
        ");
        $stmt->bindValue(':type', $type, PDO::PARAM_STR);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $items = array_map(function($row) {
            return [
                'id' => $row['id'],
                'type' => $row['type'],
                'title' => $row['title'],
                'subtitle' => $row['subtitle'] ?? '',
                'body' => $row['body'] ?? '',
                'image_url' => $row['image_url'] ?? '',
                'category' => $row['category'] ?? '',
                'published_at' => $row['published_at'] ?? null,
                'is_visible' => (bool)$row['is_visible'],
                'display_order' => intval($row['display_order'] ?? 0),
                'fields' => !empty($row['fields']) ? json_decode($row['fields'], true) : new stdClass(),
                'created_at' => $row['created_at'],
                'updated_at' => $row['updated_at']
            ];
        }, $rows);

        echo json_encode(['items' => $items, 'total' => count($items)]);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true) ?: $_POST;

        $id = !empty($data['id']) ? trim($data['id']) : uniqid($type . '_', true);
        $title = !empty($data['title']) ? trim($data['title']) : 'Untitled';
        $subtitle = !empty($data['subtitle']) ? trim($data['subtitle']) : '';
        $body = !empty($data['body']) ? trim($data['body']) : '';
        $imageUrl = !empty($data['image_url']) ? trim($data['image_url']) : '';
        $category = !empty($data['category']) ? trim($data['category']) : 'general';
        $isVisible = isset($data['is_visible']) ? (bool)$data['is_visible'] : true;
        $displayOrder = isset($data['display_order']) ? intval($data['display_order']) : 0;
        $fields = !empty($data['fields']) && is_array($data['fields']) ? json_encode($data['fields']) : '{}';

        $stmt = $conn->prepare("
            INSERT INTO admin_content (
                id, type, title, subtitle, body, image_url, category, published_at, is_visible, display_order, fields, created_at, updated_at
            ) VALUES (
                :id, :type, :title, :subtitle, :body, :image_url, :category, NOW(), :is_visible, :display_order, :fields, NOW(), NOW()
            )
            ON CONFLICT (id) DO UPDATE SET
                title = EXCLUDED.title,
                subtitle = EXCLUDED.subtitle,
                body = EXCLUDED.body,
                image_url = EXCLUDED.image_url,
                category = EXCLUDED.category,
                is_visible = EXCLUDED.is_visible,
                display_order = EXCLUDED.display_order,
                fields = EXCLUDED.fields,
                updated_at = NOW()
        ");
        $stmt->execute([
            ':id' => $id,
            ':type' => $type,
            ':title' => $title,
            ':subtitle' => $subtitle,
            ':body' => $body,
            ':image_url' => $imageUrl,
            ':category' => $category,
            ':is_visible' => $isVisible ? 1 : 0,
            ':display_order' => $displayOrder,
            ':fields' => $fields
        ]);

        echo json_encode(['success' => true, 'id' => $id]);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $id = isset($_GET['id']) ? trim($_GET['id']) : '';
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID is required for deletion.']);
            exit;
        }

        $stmt = $conn->prepare("DELETE FROM admin_content WHERE id = :id");
        $stmt->execute([':id' => $id]);

        echo json_encode(['success' => true, 'deleted' => $id]);
        exit;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
    exit;
}
