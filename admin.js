document.addEventListener("DOMContentLoaded", function () {
    console.log("JS loaded!"); // Debugging

    loadBooks(); // Load books when the page loads

    const bookStatSelect = document.getElementById("bookstat");
    updateStatusColor(); // Apply color to status dropdown

    if (bookStatSelect) {
        bookStatSelect.addEventListener("change", updateStatusColor);
    }

    function updateStatusColor() {
        if (bookStatSelect.value === "available") {
            bookStatSelect.style.backgroundColor = "darkgreen";
            bookStatSelect.style.color = "white";
        } else {
            bookStatSelect.style.backgroundColor = "darkred";
            bookStatSelect.style.color = "white";
        }
    }

    // Fetch books from the database
    async function loadBooks() {
        try {
            const response = await fetch("http://localhost/UPBooktrack/fetch_books.php");
            const books = await response.json();

            console.log("Fetched Books:", books);

            const booksList = document.getElementById("books-list");
            booksList.innerHTML = "";

            if (books.length === 0) {
                booksList.innerHTML = "<tr><td colspan='4'>No books found</td></tr>";
                return;
            }

            books.forEach(book => {
                const newRow = document.createElement("tr");

                newRow.innerHTML = `
                    <td>
                        <input type="text" class="edit-name" value="${book.bookname}" disabled>
                    </td>
                    <td><img src="${book.bookimage}" alt="Book Cover" style="width: 150px; height: auto;"></td>
                    <td>
                        <select class="book-status" disabled>
                            <option value="available" ${book.bookstat === "available" ? "selected" : ""}>Available</option>
                            <option value="not-available" ${book.bookstat === "not-available" ? "selected" : ""}>Not Available</option>
                        </select>
                    </td>
                    <td>
                        <button class="edit-button" data-id="${book.id}">Edit</button>
                        <button class="save-button" data-id="${book.id}" style="display:none;">Save</button>
                        <button class="delete-button" data-id="${book.id}">Delete</button>
                    </td>
                `;

                booksList.appendChild(newRow);
            });

            // Color change in dropdowns
            document.querySelectorAll(".book-status").forEach(select => {
                updateDropdownColor(select);
                select.addEventListener("change", function () {
                    updateDropdownColor(this);
                });
            });

            // Attach event listeners after loading books
            attachEventListeners();
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    }

    function updateDropdownColor(select) {
        if (select.value === "available") {
            select.style.backgroundColor = "darkgreen";
            select.style.color = "white";
        } else {
            select.style.backgroundColor = "darkred";
            select.style.color = "white";
        }
    }

    function attachEventListeners() {
        // Edit book details
        document.querySelectorAll(".edit-button").forEach(button => {
            button.addEventListener("click", function () {
                const row = this.closest("tr");
                row.querySelector(".edit-name").disabled = false;
                row.querySelector(".book-status").disabled = false;
                this.style.display = "none";
                row.querySelector(".save-button").style.display = "inline-block";
            });
        });

        // Save edited book details
        document.querySelectorAll(".save-button").forEach(button => {
            button.addEventListener("click", async function () {
                const row = this.closest("tr");
                const id = this.getAttribute("data-id");
                const bookname = row.querySelector(".edit-name").value;
                const bookstat = row.querySelector(".book-status").value;

                const formData = new FormData();
                formData.append("id", id);
                formData.append("bookname", bookname);
                formData.append("bookstat", bookstat);

                const response = await fetch("http://localhost/UPBooktrack/update_book.php", {
                    method: "POST",
                    body: formData
                });

                const result = await response.text();
                if (result.includes("success")) {
                    showNotification("Book updated successfully!", "success");
                    loadBooks(); // Refresh the list
                } else {
                    showNotification("Failed to update book.", "error");
                }
            });
        });

        // Delete book
        document.querySelectorAll(".delete-button").forEach(button => {
            button.addEventListener("click", async function () {
                const id = this.getAttribute("data-id");

                if (!confirm("Are you sure you want to delete this book?")) {
                    return;
                }

                const formData = new FormData();
                formData.append("id", id);

                const response = await fetch("http://localhost/UPBooktrack/delete_book.php", {
                    method: "POST",
                    body: formData
                });

                const result = await response.text();
                if (result.includes("success")) {
                    showNotification("Book deleted successfully!", "success");
                    loadBooks();
                } else {
                    showNotification("Failed to delete book.", "error");
                }
            });
        });
    }

    // Upload book
    document.getElementById("book-form").addEventListener("submit", async function (event) {
        event.preventDefault();

        const bookName = document.getElementById("bookname").value.trim();
        const bookImageInput = document.getElementById("bookimage");
        const bookStatus = document.getElementById("bookstat").value;

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

        const formData = new FormData();
        formData.append("bookname", bookName);
        formData.append("bookimage", file);
        formData.append("bookstat", bookStatus);

        try {
            const response = await fetch("http://localhost/UPBooktrack/upload_books.php", {
                method: "POST",
                body: formData,
            });

            const result = await response.text();
            console.log("Server Response:", result);

            if (result.includes("success")) {
                showNotification("Book uploaded successfully!", "success");
                loadBooks();
                document.getElementById("book-form").reset();
                document.getElementById("book-preview").style.display = "none";
                updateStatusColor();
            } else {
                showNotification(result, "error");
            }
        } catch (error) {
            console.error("Error:", error);
            showNotification("Upload failed. Please try again!", "error");
        }
    });

    // Show notifications
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
