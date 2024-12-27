<?php
// Database credentials
$servername = "https://axlchamp.github.io/";
$username = "root";
$password = "";
$dbname = "properties";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to fetch data
$sql = "SELECT * FROM property";
$result = $conn->query($sql);

// Check if there are results
if ($result->num_rows > 0) {
    header('Content-Type: application/json');
    // Output data of each row
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
} else {
    echo json_encode([]);
}

// Close connection
$conn->close();
