document.addEventListener("DOMContentLoaded", function () {
    const userIcon = document.getElementById("user-icon");
    const dropdownMenu = document.getElementById("dropdown-user");
    const logoutButton = document.getElementById("logout");

    // KINU KUHA YUNG MGA NAKA STORE NA VAL SA LOCAL STORAGE
    const studentNameElement = document.getElementById("studentName");
    const studentNoElement = document.getElementById("studentNo");

    const studentName = localStorage.getItem("studentName");
    const studentNo = localStorage.getItem("studentNo");

    console.log("Retrieved studentName:", studentName);
    console.log("Retrieved studentNo:", studentNo);

    // IF MERON ILALAGAY SA UI YUNG DATA
    if (studentNameElement && studentNoElement) {
        studentNameElement.textContent = studentName ? studentName : "Not Logged In";
        studentNoElement.textContent = studentNo ? studentNo : "N/A";
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
        localStorage.clear(); //REMOVE LAHAT NG LAMAN NG LOCAL STORAGE
        sessionStorage.clear(); // 2X DAW PRA SURE SABI NG TUTORIAL HAHAHAHA
        window.location.href = "login.html"; // BALIK SA LOGIN

        // MAKES SURE NA DI MABABALIK BY CLICKING BACK BUTTON
        history.replaceState(null, null, "login.html");
    });

    // PREVENTS GOING BACK TO LOGIN
    window.addEventListener("popstate", function () {
        window.location.href = "login.html";
    });
});
