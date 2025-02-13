document.addEventListener("DOMContentLoaded", function () {
    const userIcon = document.getElementById("user-icon");
    const dropdownMenu = document.getElementById("dropdown-user");
    const logoutButton = document.getElementById("logout");

    // Retrieve stored values
    const studentNameElement = document.getElementById("studentName");
    const studentNoElement = document.getElementById("studentNo");

    const studentName = localStorage.getItem("studentName");
    const studentNo = localStorage.getItem("studentNo");

    console.log("Retrieved studentName:", studentName);
    console.log("Retrieved studentNo:", studentNo);

    // Update UI if elements exist
    if (studentNameElement && studentNoElement) {
        studentNameElement.textContent = studentName ? studentName : "Not Logged In";
        studentNoElement.textContent = studentNo ? studentNo : "N/A";
    } else {
        console.error("Error: Element(s) not found!");
    }

    // Toggle dropdown on click
    userIcon.addEventListener("click", function (event) {
        event.stopPropagation();
        dropdownMenu.classList.toggle("show");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
        if (!userIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove("show");
        }
    });

    // Logout functionality
    logoutButton.addEventListener("click", function () {
        localStorage.clear(); // Remove user session
        sessionStorage.clear(); // Extra precaution
        window.location.href = "login.html"; // Redirect to login page

        // Prevent back button from bringing the user back
        history.replaceState(null, null, "login.html");
    });

    // Prevent going back after logout
    window.addEventListener("popstate", function () {
        window.location.href = "login.html";
    });
});
