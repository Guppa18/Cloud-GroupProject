<?php
include('./db.php');

// ADD BOOKING (POST REQUEST)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'contest') {

    // Ensure table exists
    verifyContestTable();

    // Collect data safely
    $data = array();
    $data['name'] = isset($_POST['name']) ? htmlentities($_POST['name']) : '';
    $data['email'] = isset($_POST['email']) ? htmlentities($_POST['email']) : '';
    $data['race'] = isset($_POST['race']) ? htmlentities($_POST['race']) : '';
    $data['ticketTier'] = isset($_POST['ticketTier']) ? htmlentities($_POST['ticketTier']) : '';

    // Validate inputs
    if (
        $data['name'] === '' ||
        $data['email'] === '' ||
        $data['race'] === '' ||
        $data['ticketTier'] === ''
    ) {
        echo json_encode(array(
            'message' => 'Please fill all fields',
            'status' => 'error'
        ));
        exit;
    }

    // Save booking
    addContest($data);
}


// FETCH BOOKINGS (GET REQUEST)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'contest') {

    $contest = getContest();
    echo json_encode($contest);
}
?>