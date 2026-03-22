function addBooking() {
    let name = document.getElementById("customerName").value.trim();
    let email = document.getElementById("email").value.trim();
    let race = document.getElementById("race").value;
    let ticketTier = document.getElementById("ticketTier").value;

    if (name === "" || email === "" || race === "" || ticketTier === "") {
        alert("Please fill all fields.");
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        alert("Enter valid email");
        return;
    }

    let formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("race", race);
    formData.append("ticketTier", ticketTier);
    formData.append("action", "contest");

    fetch("action.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);

        // Add to table AFTER saving
        let tableBody = document.getElementById("bookingTableBody");
        let newRow = tableBody.insertRow();

        newRow.insertCell(0).innerHTML = name;
        newRow.insertCell(1).innerHTML = email;
        newRow.insertCell(2).innerHTML = race;
        newRow.insertCell(3).innerHTML = ticketTier;

        document.getElementById("bookingForm").reset();
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Error connecting to server");
    });
}