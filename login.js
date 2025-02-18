document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); //PAGE RELOAD PREVENTION

    const studentNo = document.getElementById("studentNo").value;
    const password = document.getElementById("loginPassword").value;
    const errorMessage = document.getElementById("errorMessage");

        //MAKE SURE NA TAMA YUNG PATH
    try {
        const response = await fetch("http://localhost/UPBooktrack/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ studentNo, password })
        });

        const data = await response.json();

        if (data.status === "success") {
            // I STORE YUNG MGA INPUTS TAS DATA NA KINUHA SA DATABASE INTO LOCAL STORAGE
            localStorage.setItem("userID", data.id);
            localStorage.setItem("studentName", data.studentName);
            localStorage.setItem("studentNo", studentNo);
            localStorage.setItem("password", password)

            console.log("Stored studentName:", localStorage.getItem("studentName"));
            console.log("Stored studentNo:", localStorage.getItem("studentNo"));

            // REDIRECT SA NEXT HTML
            window.location.href = "mainpage.html";
        } else {
            errorMessage.textContent = data.message;
        }
    } catch (error) {
        errorMessage.textContent = "An error occurred. Please try again.";
    }
});
