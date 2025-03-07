document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const identifier = document.getElementById("employeeNo").value;
    const password = document.getElementById("loginPassword").value;
    const errorMessage = document.getElementById("errorMessage");

    //LOGGING FOR DEBUG
    console.log("Identifier:", identifier);
    console.log("Password:", password);

    if (!identifier || !password) {
        errorMessage.textContent = "Please fill in all fields.";
        console.error("Identifier or password is missing!");
        return;
    }

    //SEND POST
    try {
        const formData = new FormData();
        formData.append("identifier", identifier);
        formData.append("password", password);

        const response = await fetch("http://localhost/UPBooktrack/admin_login.php", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        console.log("Server Response:", data);

        if (data.status === "success") {
            console.log("Login successful! Storing user info...");

            // STORES DETAILS ON LOCALSTORAGE
            localStorage.setItem("userID", data.id);
            localStorage.setItem("employeeNo", data.employeeNo);
            localStorage.setItem("employeeName", data.employeeName);
            localStorage.setItem("employeeEmail", data.employeeEmail);

            console.log("Stored employeeName:", localStorage.getItem("employeeName"));
            console.log("Stored employeeNo:", localStorage.getItem("employeeNo"));

            // GOES TO DASHBOARD AFTER
            window.location.href = "dashboard.html";
        } else {
            errorMessage.textContent = data.message; // ERROR MESSAGE
            console.error("Login failed:", data.message);
        }
    } catch (error) {
        errorMessage.textContent = "An error occurred. Please try again.";
        console.error("Fetch error:", error);
    }
});
