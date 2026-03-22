/**
 * F1 Ticket Booking System - Final script.js
 */

// 1. AUTOMATICALLY LOAD DATA WHEN PAGE OPENS
window.onload = function() {
    loadBookings();
};

// 2. FETCH ALL BOOKINGS FROM DATABASE
function loadBookings() {
    // We call action.php with a GET request to 'contest'
    fetch("action.php?action=contest")
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        let tableBody = document.getElementById("bookingTableBody");
        tableBody.innerHTML = ""; // Clear existing table rows

        if (Array.isArray(data)) {
            data.forEach(booking => {
                renderTableRow(booking.name, booking.email, booking.race, booking.ticketTier);
            });
        }
    })
    .catch(error => {
        console.error('Error loading existing bookings:', error);
    });
}

// 3. ADD NEW BOOKING
function addBooking() {
    let name = document.getElementById("customerName").value.trim();
    let email = document.getElementById("email").value.trim();
    let race = document.getElementById("race").value;
    let ticketTier = document.getElementById("ticketTier").value;

    // Validation
    if (name === "" || email === "" || race === "" || ticketTier === "") {
        alert("Please fill all fields.");
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        alert("Please enter a valid email address.");
        return;
    }

    // Prepare data for PHP
    let formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("race", race);
    formData.append("ticketTier", ticketTier);
    formData.append("action", "contest");

    // Send POST request
    fetch("action.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);

        if (data.status === "success") {
            // Add the new row to the table immediately
            renderTableRow(name, email, race, ticketTier);
            
            // Clear the form for the next user
            document.getElementById("customerName").value = "";
            document.getElementById("email").value = "";
            document.getElementById("race").selectedIndex = 0;
            document.getElementById("ticketTier").selectedIndex = 0;
        }
    })
    .catch(error => {
        console.error('Error submitting booking:', error);
        alert("There was an error saving your booking. Please check console.");
    });
}

// 4. HELPER FUNCTION TO DRAW TABLE ROWS
function renderTableRow(name, email, race, ticketTier) {
    let tableBody = document.getElementById("bookingTableBody");
    let newRow = tableBody.insertRow();

    newRow.insertCell(0).innerHTML = name;
    newRow.insertCell(1).innerHTML = email;
    newRow.insertCell(2).innerHTML = race;
    newRow.insertCell(3).innerHTML = ticketTier;
}
