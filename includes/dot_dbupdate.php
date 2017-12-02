<?php
$servername = "localhost";
$username = "root";
$password = "cookies";
$dbname = "povertyalleviatordb";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$pbvalue = $_POST['pbvar'];

$sql = "UPDATE tblusers SET circlebar = '$pbvalue' WHERE user_id = 44 ";

if ($conn->query($sql) === TRUE) {
    echo "sql executed successfully.<br>";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>