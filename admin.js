document.addEventListener("DOMContentLoaded", async function () {
    const bookStatSelect = document.getElementById("bookstat");
    updateStatusColor(); // Apply initial color

    // ✅ Change dropdown background color based on selection
    bookStatSelect.addEventListener("change", updateStatusColor);

    function updateStatusColor() {
        if (bookStatSelect.value === "available") {
            bookStatSelect.style.backgroundColor = "darkgreen";
            bookStatSelect.style.color = "white";
        } else {
            bookStatSelect.style.backgroundColor = "darkred";
            bookStatSelect.style.color = "white";
        }
    }

    // ✅ Fetch and display books from database
    async function loadBooks() {
        try {
            const response = await fetch("http://localhost/UPBooktrack/fetch_books.php");
            const books = await response.json();

            const booksList = document.getElementById("books-list");
            booksList.innerHTML = ""; // Clear existing content

            books.forEach(book => {
                const newRow = document.createElement("tr");

                newRow.innerHTML = `
                    <td>${book.bookname}</td>
                    <td><img src="http://localhost/UPBooktrack/uploads/${book.bookimage}" alt="Book Cover" style="width: 50px; height: auto;"></td>
                    <td>
                        <select class="book-status">
                            <option value="available" ${book.bookstat === "available" ? "selected" : ""}>Available</option>
                            <option value="not-available" ${book.bookstat === "not-available" ? "selected" : ""}>Not Available</option>
                        </select>
                    </td>
                    <td><button class="edit-button">Edit</button> <button class="delete-button">Delete</button></td>
                `;

                booksList.appendChild(newRow);
            });

            // ✅ Apply color changes to status dropdowns
            document.querySelectorAll(".book-status").forEach(select => {
                updateDropdownColor(select);
                select.addEventListener("change", function () {
                    updateDropdownColor(this);
                });
            });

        } catch (error) {
            console.error("Error fetching books:", error);
        }
    }

    // ✅ Function to update dropdown color for dynamically added rows
    function updateDropdownColor(selectElement) {
        if (selectElement.value === "available") {
            selectElement.style.backgroundColor = "darkgreen";
            selectElement.style.color = "white";
        } else {
            selectElement.style.backgroundColor = "darkred";
            selectElement.style.color = "white";
        }
    }

    // ✅ Load books on page load
    loadBooks();

    // ✅ Handle book uploads
    document.getElementById("book-form").addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        // 🔹 Get input values
        const bookName = document.getElementById("bookname").value.trim();
        const bookImageInput = document.getElementById("bookimage");
        const bookStatus = document.getElementById("bookstat").value;

        // 🔹 Validate Inputs
        if (!bookName) {
            showNotification("Please enter a book name!", "error");
            return;
        }

        if (!bookImageInput.files.length) {
            showNotification("Please select a book image!", "error");
            return;
        }

        const file = bookImageInput.files[0];
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
            showNotification("Invalid file type! Upload an image (JPG, PNG).", "error");
            return;
        }

        // 🔹 Prepare Form Data
        const formData = new FormData();
        formData.append("bookname", bookName);
        formData.append("bookimage", file);
        formData.append("bookstat", bookStatus);

        try {
            // 🔹 Send Data to PHP Backend
            const response = await fetch("http://localhost/UPBooktrack/upload_books.php", {
                method: "POST",
                body: formData,
            });

            const result = await response.text(); // Get response from PHP

            console.log("Server Response:", result); // Log response for debugging

            // ✅ Show notification based on PHP response
            if (result.includes("success")) {
                showNotification("Book uploaded successfully!", "success");

                // ✅ Reload books list after upload
                loadBooks();

                document.getElementById("book-form").reset(); // Reset form
                document.getElementById("book-preview").style.display = "none"; // Hide preview

                updateStatusColor(); // ✅ Reset dropdown color
            } else {
                showNotification(result, "error"); // Show error message from PHP
            }
        } catch (error) {
            console.error("Error:", error);
            showNotification("Upload failed. Please try again!", "error");
        }
    });

    // ✅ Notification Function
    function showNotification(message, type) {
        const notification = document.createElement("div");
        notification.className = `notification ${type}`;
        notification.innerText = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = "0";
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
});
