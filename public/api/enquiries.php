<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true) ?: $_POST;

    $source = isset($data['source']) ? trim($data['source']) : 'contact';
    $fields = isset($data['fields']) && is_array($data['fields']) ? $data['fields'] : $data;

    $name = isset($fields['name']) ? trim($fields['name']) : '';
    $contact = isset($fields['contact']) ? trim($fields['contact']) : (isset($fields['phone']) ? trim($fields['phone']) : (isset($fields['mobile']) ? trim($fields['mobile']) : ''));
    $email = isset($fields['email']) ? trim($fields['email']) : '';

    if (empty($name) || empty($contact)) {
        http_response_code(400);
        echo json_encode(['error' => 'Name and contact number are required.']);
        exit;
    }

    $id = uniqid('enq_', true);
    $now = date('Y-m-d H:i:sP');
    $fieldsJson = json_encode($fields);

    try {
        $conn = OpenCon();
        if ($conn instanceof PDO) {
            $stmt = $conn->prepare("
                INSERT INTO enquiries (id, source, name, contact, email, status, submitted_data, created_at, updated_at)
                VALUES (:id, :source, :name, :contact, :email, 'Not Contacted', :fields, :created_at, :updated_at)
            ");
            $stmt->execute([
                ':id' => $id,
                ':source' => $source,
                ':name' => $name,
                ':contact' => $contact,
                ':email' => $email,
                ':fields' => $fieldsJson,
                ':created_at' => $now,
                ':updated_at' => $now
            ]);
        } elseif (is_resource($conn)) {
            $escId = pg_escape_string($conn, $id);
            $escSource = pg_escape_string($conn, $source);
            $escName = pg_escape_string($conn, $name);
            $escContact = pg_escape_string($conn, $contact);
            $escEmail = pg_escape_string($conn, $email);
            $escFields = pg_escape_string($conn, $fieldsJson);
            $escNow = pg_escape_string($conn, $now);

            $query = "INSERT INTO enquiries (id, source, name, contact, email, status, submitted_data, created_at, updated_at)
                      VALUES ('{$escId}', '{$escSource}', '{$escName}', '{$escContact}', '{$escEmail}', 'Not Contacted', '{$escFields}'::jsonb, '{$escNow}', '{$escNow}')";
            pg_query($conn, $query);
        }

        CloseCon($conn);

        echo json_encode([
            'success' => true,
            'message' => 'Enquiry submitted successfully.',
            'enquiry' => [
                'id' => $id,
                'source' => $source,
                'name' => $name,
                'contact' => $contact,
                'email' => $email,
                'created_at' => $now
            ]
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed.']);
?>
