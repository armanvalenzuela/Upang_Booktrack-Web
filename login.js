document.addEventListener("DOMContentLoaded", function () {
    // GET REMEMBER ME VALUES
    const savedIdentifier = localStorage.getItem("rememberedEmployeeNo");
    if (savedIdentifier) {
        document.getElementById("employeeNo").value = savedIdentifier;
        document.getElementById("rememberMe").checked = true;
    }
});

document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const identifier = document.getElementById("employeeNo").value;
    const password = document.getElementById("loginPassword").value;
    const rememberMe = document.getElementById("rememberMe");
    const errorMessage = document.getElementById("errorMessage");

    // Logging for Debug
    console.log("Identifier:", identifier);
    console.log("Password:", password);

    if (!identifier || !password) {
        errorMessage.textContent = "Please fill in all fields.";
        console.error("Identifier or password is missing!");
        return;
    }

    // Store identifier if "Remember Me" is checked, otherwise remove it
    if (rememberMe.checked) {
        localStorage.setItem("rememberedEmployeeNo", identifier);
    } else {
        localStorage.removeItem("rememberedEmployeeNo");
    }

    // Send POST request
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

            // Store user details in localStorage
            localStorage.setItem("userID", data.id);
            localStorage.setItem("employeeNo", data.employeeNo);
            localStorage.setItem("employeeName", data.employeeName);
            localStorage.setItem("employeeEmail", data.employeeEmail);

            console.log("Stored employeeName:", localStorage.getItem("employeeName"));
            console.log("Stored employeeNo:", localStorage.getItem("employeeNo"));

            // Redirect to dashboard
            window.location.href = "dashboard.html";
        } else {
            errorMessage.textContent = data.message; // Display error message
            console.error("Login failed:", data.message);
        }
    } catch (error) {
        errorMessage.textContent = "An error occurred. Please try again.";
        console.error("Fetch error:", error);
    }
});
