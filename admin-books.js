document.addEventListener("DOMContentLoaded", function () {
    const bookForm = document.getElementById("book-form");
    const bookNameInput = document.getElementById("bookname");
    const bookImageInput = document.getElementById("bookimage");
    const bookStatSelect = document.getElementById("bookstat");
    const saveButton = document.getElementById("save-button");
    const previewImage = document.getElementById("book-preview");

    // BACKGROUND COLOR OF DROPDOWN BASED ON SELECTION
    function updateStatusColor() {
        if (bookStatSelect.value === "available") {
            bookStatSelect.style.backgroundColor = "lightgreen"; // Green for available
            bookStatSelect.style.color = "black";
        } else {
            bookStatSelect.style.backgroundColor = "lightcoral"; // Red for not available
            bookStatSelect.style.color = "white";
        }
    }
    bookStatSelect.addEventListener("change", updateStatusColor);
    updateStatusColor(); // Run initially

    // IMAGE PREVIEW
    function previewImageFile(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                previewImage.src = e.target.result;
                previewImage.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    }
    bookImageInput.addEventListener("change", previewImageFile);

    // FORM VALIDATION
    function validateForm() {
        if (!bookNameInput.value.trim()) {
            alert("Please enter a book name.");
            return false;
        }
        if (!bookImageInput.files.length) {
            alert("Please select an image.");
            return false;
        }
        const file = bookImageInput.files[0];
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            alert("Invalid file type. Please upload an image (JPG, PNG, GIF).");
            return false;
        }
        return true;
    }

    // HANDLE FORM SUBMISSION USING AJAX
    bookForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        if (!validateForm()) {
            return;
        }

        const formData = new FormData(bookForm);

        fetch("upload-books.php", {
            method: "POST",
            body: formData,
        })
        .then(response => response.text())
        .then(data => {
            alert(data); // Show response from PHP
            bookForm.reset(); // Reset form after successful upload
            previewImage.style.display = "none"; // Hide preview
            updateStatusColor(); // Reset dropdown color
        })
        .catch(error => console.error("Error:", error));
    });
});
