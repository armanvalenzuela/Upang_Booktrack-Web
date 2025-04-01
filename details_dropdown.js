document.addEventListener("DOMContentLoaded", function () {
    const userIcon = document.getElementById("user-icon");
    const dropdownMenu = document.getElementById("dropdown-user");
    const logoutButton = document.getElementById("logout");

    // KINUHA YUNG MGA NAKA STORE NA VAL SA LOCAL STORAGE
    const employeeNameElement = document.getElementById("employeeName");
    const employeeNoElement = document.getElementById("employeeNo");

    const employeeName = localStorage.getItem("employeeName");
    const employeeNo = localStorage.getItem("employeeNo");

    console.log("Retrieved employeeName:", employeeName);
    console.log("Retrieved employeeNo:", employeeNo);

    // IF MERON, ILALAGAY SA UI YUNG DATA
    if (employeeNameElement && employeeNoElement) {
        employeeNameElement.textContent = employeeName ? employeeName : "Not Logged In";
        employeeNoElement.textContent = employeeNo ? employeeNo : "N/A";
    } else {
        console.error("Error: Element(s) not found!");
    }

    // DROPDOWN TOGGLE
    userIcon.addEventListener("click", function (event) {
        event.stopPropagation();
        dropdownMenu.classList.toggle("show");
    });

    // CLOSES DROPDOWN IF NAG CLICK KA SA LABAS NG AREA
    document.addEventListener("click", function (event) {
        if (!userIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove("show");
        }
    });

    // LOGOUT FUNCTIONALITY
    logoutButton.addEventListener("click", function () {
        // Clear both localStorage and sessionStorage
        localStorage.clear(); // REMOVE LAHAT NG LAMAN NG LOCAL STORAGE
        sessionStorage.clear(); // 2X DAW PRA SURE SABI NG TUTORIAL HAHAHAHA

        // Redirect to login page
        window.location.href = "login.html"; // BALIK SA LOGIN

        // MAKES SURE NA DI MABABALIK BY CLICKING BACK BUTTON
        history.replaceState(null, null, "login.html");
    });

    // PREVENTS GOING BACK TO LOGIN
    window.addEventListener("popstate", function () {
        window.location.href = "login.html";
    });
});
