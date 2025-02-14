document.addEventListener("DOMContentLoaded", function () {
    const btnSubmit = document.querySelector(".btnSubmit");

    

    btnSubmit.addEventListener("click", function (event) {
        event.preventDefault(); // PREVENTS REFRESH NG SUBMISSION

        //GET YUNG USER DATA SA LOCAL STORAGE
        const userId = localStorage.getItem("userID");
        const oldPassword = document.getElementById("oldPassword").value.trim();
        const newPassword = document.getElementById("newPassword").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        // VALIDATIONS
        if (!userId) {
            showToast("User not logged in!", "error");
            return;
        }

        if (!oldPassword || !newPassword || !confirmPassword) {
            showToast("All fields are required!", "error");
            return;
        }

        if (newPassword.includes(" ")) {
            showToast("New password cannot contain spaces!", "error");
            return;
        }

        if (newPassword !== confirmPassword) {
            showToast("New passwords do not match!", "error");
            return;
        }

        // DITO PRINE PREPARE YUNG REQUEST
        const formData = new FormData();
        formData.append("id", userId);
        formData.append("oldPassword", oldPassword);
        formData.append("newPassword", newPassword);

        //MAKE SURE NA TAMA YUNG PATH HA!
        fetch("http://localhost/UPBooktrack/change_password_WEB.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                showToast("Password changed successfully! Please Log in Again!", "success");
                setTimeout(() => {
                    window.location.href = "login.html"; // BALIK SA LOGIN
                }, 2000);
            } else {
                showToast(data.message, "error"); //IF DI NAGANA PAPAKITA YUNG ERRORS
            }
        })
        .catch(error => {
            console.error("Error:", error);
            showToast("An error occurred while changing the password.", "error");
        });
    });
});

// Function to toggle password visibility
function togglePassword(inputId, toggleIconId) {
    const inputField = document.getElementById(inputId);
    const toggleIcon = document.getElementById(toggleIconId);

    if (inputField.type === "password") {
        inputField.type = "text";
        toggleIcon.classList.replace("bx-show", "bx-hide");
    } else {
        inputField.type = "password";
        toggleIcon.classList.replace("bx-hide", "bx-show");
    }
}

// Toast Notification Function
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    toast.textContent = message;

    // Apply different styles based on message type
    toast.style.backgroundColor = type === "error" ? "red" : "green";

    // Show the toast
    toast.classList.add("show");

    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}
