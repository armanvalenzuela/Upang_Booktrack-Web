document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const identifier = document.getElementById("studentNo").value;
    const password = document.getElementById("loginPassword").value;
    const errorMessage = document.getElementById("errorMessage");

    console.log("Identifier:", identifier);
    console.log("Password:", password);

    if (!identifier || !password) {
        errorMessage.textContent = "Please fill in all fields.";
        console.error("Identifier or password is missing!");
        return;
    }

    try {
        // Use FormData to send data properly
        const formData = new FormData();
        formData.append("identifier", identifier);
        formData.append("password", password);

        // Send the request
        const response = await fetch("http://localhost/UPBooktrack/login.php", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        console.log("Server Response:", data);

        if (data.status === "success") {
            console.log("Login successful! Storing user info...");

            // Store user details in localStorage
            localStorage.setItem("userID", data.id);
            localStorage.setItem("studentNo", data.studentNo);
            localStorage.setItem("studentName", data.studentName);
            localStorage.setItem("email", data.email);

            console.log("Stored studentName:", localStorage.getItem("studentName"));
            console.log("Stored studentNo:", localStorage.getItem("studentNo"));

            // Redirect to main page
            window.location.href = "mainpage.html";
        } else {
            errorMessage.textContent = data.message; // Display error message
            console.error("Login failed:", data.message);
        }
    } catch (error) {
        errorMessage.textContent = "An error occurred. Please try again.";
        console.error("Fetch error:", error);
    }
});
