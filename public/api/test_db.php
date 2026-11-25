<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

require_once __DIR__ . '/db.php';

try {
    $conn = OpenCon();
    $serverVersion = "Unknown";
    $tables = [];

    if ($conn instanceof PDO) {
        $stmt = $conn->query("SELECT version();");
        $verRow = $stmt->fetch();
        $serverVersion = $verRow ? $verRow['version'] : 'Connected';

        $tblStmt = $conn->query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;");
        $tables = $tblStmt->fetchAll(PDO::FETCH_COLUMN);
    } elseif (is_resource($conn)) {
        $res = @pg_query($conn, "SELECT version();");
        if ($res && $row = @pg_fetch_row($res)) {
            $serverVersion = $row[0];
        }
        $tblRes = @pg_query($conn, "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;");
        if ($tblRes) {
            while ($tblRow = @pg_fetch_row($tblRes)) {
                $tables[] = $tblRow[0];
            }
        }
    }

    CloseCon($conn);

    echo json_encode([
        'status' => 'success',
        'message' => 'PostgreSQL database connected successfully!',
        'host' => getenv("PGHOST") ?: (getenv("DB_HOST") ?: "localhost"),
        'port' => 5432,
        'database' => 'sjrsr258_sjrpsraj',
        'server_version' => $serverVersion,
        'tables' => $tables,
        'timestamp' => date('c')
    ], JSON_PRETTY_PRINT);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
?>
