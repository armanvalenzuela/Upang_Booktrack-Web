document.addEventListener("DOMContentLoaded", function () {
    const genderRadios = document.querySelectorAll('input[name="gender"]');
    const genderLabels = document.querySelectorAll(".radio-label");

    genderRadios.forEach((radio) => {
        radio.addEventListener("change", function () {
            genderLabels.forEach(label => label.classList.remove("selected"));
            this.parentNode.classList.add("selected");
        });
    });
});

document.getElementById("signupForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // PREVENT DEFAULT FORM SUBMISSION

    // KUNIN MGA VALUES
    const firstName = document.getElementById("first_name").value.trim();
    const lastName = document.getElementById("last_name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const message = document.getElementById("message");

    let gender = document.querySelector('input[name="gender"]:checked')?.value; // GET SELECTED GENDER
    const college = document.getElementById("college").value; // GET SELECTED COLLEGE

    // CHECK IF GENDER IS SELECTED
    if (!gender) {
        message.style.color = "red";
        message.innerText = "Please select a gender!";
        return;
    }

    // FORMAT GENDER TO "Male" OR "Female"
    gender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();

    // TIGNAN IF MATCH YUNG 2 NA PASS
    if (password !== confirmPassword) {
        message.style.color = "red";
        message.innerText = "Passwords do not match!";
        return;
    }

    // DATA PREPARATION
    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("gender", gender); // ADD FORMATTED GENDER
    formData.append("college", college); // ADD COLLEGE TO FORM DATA

    try {
        const response = await fetch("http://localhost/UPBooktrack/signup.php", {
            method: "POST",
            body: formData,
        });

        const result = await response.text(); // DITO WINA WAIT PHP RESPONSE
        message.innerHTML = result;
        message.style.color = result.includes("successful") ? "green" : "red";

        if (result.includes("Registration successful")) {
            // GAWING UNCLICKABLE LAHAT IF NAG RE REDIRECT
            document.body.style.pointerEvents = "none";
            message.style.pointerEvents = "auto"; // PWEDE I CLICK MGA TEXT LIKE COPY GANON

            setTimeout(() => {
                window.location.replace("login.html"); // BACK TO LOGIN
            }, 5000);
        }

    } catch (error) {
        console.error("Error:", error);
        message.innerText = "Registration failed. Try again.";
        message.style.color = "red";
    }
});
