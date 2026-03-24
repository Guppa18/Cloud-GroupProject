/**
 * F1 Ticket Booking System - Final script.js
 */

// ==========================================
// 1. ROLEX COUNTDOWN TIMER LOGIC
// ==========================================

// Set the date we're counting down to (F1 2026 Season Finale - Estimated)
const countDownDate = new Date("Dec 6, 2026 15:00:00").getTime();

// Update the countdown every 1 second
const timerInterval = setInterval(function() {

    // Get today's date and time
    const now = new Date().getTime();

    // Find the distance between now and the countdown date
    const distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the corresponding HTML elements
    // We add a "0" in front of single digit numbers for a cleaner clock look
    document.getElementById("days").innerHTML = days < 10 ? "0" + days : days;
    document.getElementById("hours").innerHTML = hours < 10 ? "0" + hours : hours;
    document.getElementById("minutes").innerHTML = minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("seconds").innerHTML = seconds < 10 ? "0" + seconds : seconds;

    // If the countdown is finished, write some text 
    if (distance < 0) {
        clearInterval(timerInterval);
        document.getElementById("rolexTimer").innerHTML = "<h3 style='color: #A37E2C;'>SEASON CONCLUDED</h3>";
    }
}, 1000);

// 2. AUTOMATICALLY LOAD DATA WHEN PAGE OPENS
window.onload = function() {
    loadBookings();
};

// 3. FETCH ALL BOOKINGS FROM DATABASE
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
