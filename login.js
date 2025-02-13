document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent page reload

    const studentNo = document.getElementById("studentNo").value;
    const password = document.getElementById("loginPassword").value;
    const errorMessage = document.getElementById("errorMessage");

    try {
        const response = await fetch("http://localhost/UPBooktrack/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ studentNo, password })
        });

        const data = await response.json();

        if (data.status === "success") {
            // Store user details in localStorage
            localStorage.setItem("userID", data.id);
            localStorage.setItem("studentName", data.studentName);
            localStorage.setItem("studentNo", studentNo);

            console.log("Stored studentName:", localStorage.getItem("studentName"));
            console.log("Stored studentNo:", localStorage.getItem("studentNo"));

            // Redirect to bkcite.html
            window.location.href = "bkcite.html";
        } else {
            errorMessage.textContent = data.message;
        }
    } catch (error) {
        errorMessage.textContent = "An error occurred. Please try again.";
    }
});
