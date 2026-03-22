<?php
include('./db.php');

// 1. ADD BOOKING (POST REQUEST)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'contest') {

    // Ensure table exists before inserting
    verifyContestTable();

    // Collect data safely
    $data = array();
    $data['name'] = isset($_POST['name']) ? htmlentities($_POST['name']) : '';
    $data['email'] = isset($_POST['email']) ? htmlentities($_POST['email']) : '';
    $data['race'] = isset($_POST['race']) ? htmlentities($_POST['race']) : '';
    $data['ticketTier'] = isset($_POST['ticketTier']) ? htmlentities($_POST['ticketTier']) : '';

    // Validate inputs
    if (empty($data['name']) || empty($data['email']) || empty($data['race']) || empty($data['ticketTier'])) {
        echo json_encode(array(
            'message' => 'Please fill all fields',
            'status' => 'error'
        ));
        exit;
    }

    // Save booking
    addContest($data);
}


// 2. FETCH BOOKINGS (GET REQUEST)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'contest') {
    
    // Added Fix: Ensure table exists before we try to SELECT from it
    verifyContestTable();

    $contest = getContest();
    echo json_encode($contest);
    exit;
}
?>
