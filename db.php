<?php
define('DB_SERVER', 'f1tickets.cntbvydiscc4.us-east-1.rds.amazonaws.com');
define('DB_USERNAME', 'admin');
define('DB_PASSWORD', 'Password');
define('DB_DATABASE', 'f1tickets');

/* Connect to MySQL and Select Database */
$database = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);

if (!$database) {
    echo json_encode(array(
        'message' => "Failed to connect to MySQL: " . mysqli_connect_error(),
        'status' => 'error'
    ));
    die();
}

/* INSERT BOOKING */
function addContest($data) {
    global $database;

    $name = mysqli_real_escape_string($database, $data['name']);
    $email = mysqli_real_escape_string($database, $data['email']);
    $race = mysqli_real_escape_string($database, $data['race']);
    $ticketTier = mysqli_real_escape_string($database, $data['ticketTier']);

    $query = "INSERT INTO BOOKINGS (name, email, race, ticketTier) 
              VALUES ('$name', '$email', '$race', '$ticketTier');";

    if (!mysqli_query($database, $query)) {
        echo json_encode(array(
            'message' => 'Error saving booking',
            'status' => 'error',
            'sql_error' => mysqli_error($database)
        ));
        die();
    } else {
        echo json_encode(array(
            'message' => 'Booking successful!',
            'status' => 'success'
        ));
        die();
    }
}

/* CREATE TABLE IF NOT EXISTS */
function verifyContestTable() {
    global $database;
    $table = 'BOOKINGS';

    if (!isTableExists($table)) {
        $query = "CREATE TABLE $table (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(100),
            race VARCHAR(255),
            ticketTier VARCHAR(100),
            created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );";

        if (!mysqli_query($database, $query)) {
            echo json_encode(array(
                'message' => 'Error creating table!',
                'status' => 'error',
                'sql_error' => mysqli_error($database)
            ));
            die();
        }
    }
}

/* CHECK TABLE EXISTS */
function isTableExists($tableName) {
    global $database; // Changed from $connection to $database

    $t = mysqli_real_escape_string($database, $tableName);
    $d = mysqli_real_escape_string($database, DB_DATABASE);

    $checktable = mysqli_query(
        $database,
        "SELECT TABLE_NAME FROM information_schema.TABLES 
         WHERE TABLE_NAME = '$t' AND TABLE_SCHEMA = '$d'"
    );

    return mysqli_num_rows($checktable) > 0;
}

/* FETCH BOOKINGS */
function getContest() {
    global $database;
    $data = array();
    $query = "SELECT * FROM BOOKINGS ORDER BY id DESC";

    if ($result = mysqli_query($database, $query)) {
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = $row;
        }
        mysqli_free_result($result);
    }

    return $data;
}
?>
