document.addEventListener("DOMContentLoaded", function () {
    console.log("JS loaded!"); // Debugging

    loadBooks(); // I run agad yung function na kunin books

    const bookStatSelect = document.getElementById("bookstat");
    updateStatusColor(); // Dito yung pag lagay ng color sa selected

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

    // Dito yung pag fetch nya ng books
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
                    <td>${book.bookname}</td>
                    <td><img src="${book.bookimage}" alt="Book Cover" style="width: 50px; height: auto;"></td>
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

            // Colorchange sa dropdown
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

    function updateDropdownColor(select) {
        if (select.value === "available") {
            select.style.backgroundColor = "darkgreen";
            select.style.color = "white";
        } else {
            select.style.backgroundColor = "darkred";
            select.style.color = "white";
        }
    }

    // Book uploading
    document.getElementById("book-form").addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Getting ng values
        const bookName = document.getElementById("bookname").value.trim();
        const bookImageInput = document.getElementById("bookimage");
        const bookStatus = document.getElementById("bookstat").value;

        // Validations syempre
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

        // Preparing form data (yung kung ano ibibigay sa POST natin)
        const formData = new FormData();
        formData.append("bookname", bookName);
        formData.append("bookimage", file);
        formData.append("bookstat", bookStatus);

        try {
            // Dito yung pag sesendang ng data
            const response = await fetch("http://localhost/UPBooktrack/upload_books.php", {
                method: "POST",
                body: formData,
            });

            const result = await response.text(); // Antayin yung response ng php

            console.log("Server Response:", result); // Log response

            // Yung notification ng response
            if (result.includes("success")) {
                showNotification("Book uploaded successfully!", "success");

                // And after upload mag re refresh yung list
                loadBooks();

                document.getElementById("book-form").reset();
                document.getElementById("book-preview").style.display = "none";

                updateStatusColor();
            } else {
                showNotification(result, "error"); //Show the error messages (sa php naka set mga error messages)
            }
        } catch (error) {
            console.error("Error:", error);
            showNotification("Upload failed. Please try again!", "error");
        }
    });

    // Notification message
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
