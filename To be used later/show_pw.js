function togglePassword(inputId, iconId) {
    let passwordInput = document.getElementById(inputId);
    let toggleIcon = document.getElementById(iconId);

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.classList.remove("bx-show");
        toggleIcon.classList.add("bx-hide");
    } else {
        passwordInput.type = "password";
        toggleIcon.classList.remove("bx-hide");
        toggleIcon.classList.add("bx-show");
    }
}
