<?php
/**
 * Database Connection for SJR Public School Rajajinagar
 * Domain: sjrpsraj.sjres.edu.in
 * Database Engine: PostgreSQL 14 (Port 5432)
 */

function OpenCon()
{
    $dbhost = getenv("PGHOST") ?: (getenv("DB_HOST") ?: "localhost");
    $dbport = getenv("PGPORT") ?: "5432";
    $dbuser = getenv("PGUSER") ?: "sjrsr258_sjrpsraj";
    $dbpass = getenv("PGPASSWORD") ?: "+7v#qvBj9Y*!L9-N&S";
    $dbname = getenv("PGDATABASE") ?: "sjrsr258_sjrpsraj";

    // 1. PDO PostgreSQL (Recommended modern driver)
    if (extension_loaded('pdo_pgsql') || class_exists('PDO')) {
        try {
            $dsn = "pgsql:host={$dbhost};port={$dbport};dbname={$dbname}";
            $conn = new PDO($dsn, $dbuser, $dbpass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
            return $conn;
        } catch (PDOException $e) {
            // Fall through to pg_connect if available
        }
    }

    // 2. Native pg_connect driver
    if (function_exists('pg_connect')) {
        $connStr = "host={$dbhost} port={$dbport} dbname={$dbname} user={$dbuser} password={$dbpass}";
        $conn = @pg_connect($connStr);
        if ($conn) {
            return $conn;
        }
    }

    // If both fail, output error
    header('HTTP/1.1 500 Internal Server Error');
    die("Database Connection failed: Unable to connect to PostgreSQL at {$dbhost}:{$dbport} ({$dbname}). Ensure pdo_pgsql or pgsql PHP extension is enabled.");
}

function CloseCon($conn)
{
    if ($conn instanceof PDO) {
        $conn = null;
    } elseif (is_resource($conn) && function_exists('pg_close')) {
        @pg_close($conn);
    }
}
?>
