document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".otp-button").addEventListener("click", sendOTP);
    document.querySelector(".btnSubmit").addEventListener("click", resetPassword);
});

// SEND OTP CODE FUNCTION
async function sendOTP() {
    const email = document.getElementById("email").value.trim();
    const message = getMessageElement();

    if (!email) {
        displayMessage("Please enter your email!", "red");
        return;
    }

    // SHOW VERIFYING MESSAGE
    displayMessage("Verifying email, please wait...", "green");

    try {
        const response = await fetch("http://localhost/UPBooktrack/forgot_password.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `email=${encodeURIComponent(email)}`
        });

        const result = await response.text();
        displayMessage(result, result.includes("OTP code Sent!") ? "green" : "red");
    } catch (error) {
        console.error("Error:", error);
        displayMessage("Failed to send OTP. Try again!", "red");
    }
}

// RESET PASSWORD
async function resetPassword(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const otp = document.getElementById("otp").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const message = getMessageElement();

    if (!email || !otp || !newPassword || !confirmPassword) {
        displayMessage("All fields are required!", "red");
        return;
    }

    if (newPassword !== confirmPassword) {
        displayMessage("Passwords do not match!", "red");
        return;
    }

    // PROCESSING REQUEST MESSAGE
    displayMessage("Processing reset request, please wait...", "green");

    try {
        const response = await fetch("http://localhost/UPBooktrack/verify_reset_password.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}&newPassword=${encodeURIComponent(newPassword)}`
        });

        const result = await response.text();
        displayMessage(result, result.includes("successful") ? "green" : "red");

        if (result.includes("successful")) {
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        }
    } catch (error) {
        console.error("Error:", error);
        displayMessage("Failed to reset password. Try again!", "red");
    }
}

// MESSAGE (YUNG LUMALABAS NA MESSAGE)
function getMessageElement() {
    let message = document.getElementById("otpMessage");
    if (!message) {
        message = document.createElement("span");
        message.id = "otpMessage";
        message.className = "otp-message";
        document.querySelector(".input-box").after(message);
    }
    return message;
}

// STYLE NG MESSAGE
function displayMessage(text, color) {
    const message = getMessageElement();
    message.innerText = text;
    message.style.color = color;
    message.style.fontWeight = "bold";
    message.style.marginLeft = "10px";
}
