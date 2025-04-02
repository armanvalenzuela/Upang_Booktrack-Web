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

    // LOGGING FOR DEBUG
    console.log("Identifier:", identifier);
    console.log("Password:", password);

    if (!identifier || !password) {
        errorMessage.textContent = "Please fill in all fields.";
        console.error("Identifier or password is missing!");
        return;
    }

    // STORE IDENTIFIER IF REMEMBER ME IS SELECTED? OR CHECKED
    if (rememberMe.checked) {
        localStorage.setItem("rememberedEmployeeNo", identifier);
    } else {
        localStorage.removeItem("rememberedEmployeeNo");
    }

    // SEND POST
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

            // STORE USER DETAILS IN LOCAL STORAGE
            localStorage.setItem("userID", data.id);
            localStorage.setItem("employeeNo", data.employeeNo);
            localStorage.setItem("employeeName", data.employeeName);
            localStorage.setItem("employeeEmail", data.employeeEmail);

            console.log("Stored employeeName:", localStorage.getItem("employeeName"));
            console.log("Stored employeeNo:", localStorage.getItem("employeeNo"));

            // GOES TO DASHBOARD AFTER
            window.location.href = "dashboard.html";
        } else {
            errorMessage.textContent = data.message;
            console.error("Login failed:", data.message);
        }
    } catch (error) {
        errorMessage.textContent = "An error occurred. Please try again.";
        console.error("Fetch error:", error);
    }
});
