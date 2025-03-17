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
                booksList.innerHTML = "<tr><td colspan='7'>No books found</td></tr>";
                return;
            }

            books.forEach(book => {
                const newRow = document.createElement("tr");

                newRow.innerHTML = `
                    <td>
                        <select class="edit-college" disabled>
                            <option value="CITE" ${book.bookcollege === "CITE" ? "selected" : ""}>CITE</option>
                            <option value="CMA" ${book.bookcollege === "CMA" ? "selected" : ""}>CMA</option>
                            <option value="CAHS" ${book.bookcollege === "CAHS" ? "selected" : ""}>CAHS</option>
                            <option value="CEA" ${book.bookcollege === "CEA" ? "selected" : ""}>CEA</option>
                        </select>
                    </td>
                    <td>
                        <input type="text" class="edit-name" value="${book.bookname}" disabled>
                    </td>
                    <td>
                        <textarea class="edit-desc" disabled>${book.bookdesc}</textarea>
                    </td>
                    <td><img src="${book.bookimage}" alt="Book Cover" style="width: 150px; height: auto;"></td>
                    <td>
                        <input type="number" class="edit-stock" value="${book.bookstock}" disabled>
                    </td>
                    <td>
                        <select class="book-status" disabled>
                            <option value="available" ${book.bookstat === "available" ? "selected" : ""}>Available</option>
                            <option value="not-available" ${book.bookstat === "not-available" ? "selected" : ""}>Not Available</option>
                        </select>
                    </td>
                    <td>
                        <button class="edit-button" data-book-id="${book.book_id}">Edit</button>
                        <button class="save-button" data-book-id="${book.book_id}" style="display:none;">Save</button>
                        <button class="delete-button" data-book-id="${book.book_id}">Delete</button>
                    </td>
                `;

                booksList.appendChild(newRow);
            });

            document.querySelectorAll(".book-status").forEach(select => {
                updateDropdownColor(select);
                select.addEventListener("change", function () {
                    updateDropdownColor(this);
                });
            });

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
        document.querySelectorAll(".edit-button").forEach(button => {
            button.addEventListener("click", function () {
                const row = this.closest("tr");
                row.querySelector(".edit-college").disabled = false;
                row.querySelector(".edit-name").disabled = false;
                row.querySelector(".edit-desc").disabled = false;
                row.querySelector(".edit-stock").disabled = false;
                row.querySelector(".book-status").disabled = false;
                this.style.display = "none";
                row.querySelector(".save-button").style.display = "inline-block";
            });
        });

        document.querySelectorAll(".save-button").forEach(button => {
            button.addEventListener("click", async function () {
                const row = this.closest("tr");
                const book_id = this.getAttribute("data-book-id");
                const bookcollege = row.querySelector(".edit-college").value;
                const bookname = row.querySelector(".edit-name").value;
                const bookdesc = row.querySelector(".edit-desc").value;
                const bookstock = row.querySelector(".edit-stock").value.trim();
                const bookstat = row.querySelector(".book-status").value;

                // Ensure stock is allowed to be 0 but not empty
                if (bookstock === "") {
                    showNotification("Stock cannot be empty!", "error");
                    return;
                }

                const formData = new FormData();
                formData.append("book_id", book_id);
                formData.append("bookcollege", bookcollege);
                formData.append("bookname", bookname);
                formData.append("bookdesc", bookdesc);
                formData.append("bookstock", bookstock);
                formData.append("bookstat", bookstat);

                const response = await fetch("http://localhost/UPBooktrack/update_book.php", {
                    method: "POST",
                    body: formData
                });

                const result = await response.text();
                if (result.includes("success")) {
                    showNotification("Book updated successfully!", "success");
                    loadBooks();
                } else {
                    showNotification("Failed to update book.", "error");
                }
            });
        });

        document.querySelectorAll(".delete-button").forEach(button => {
            button.addEventListener("click", async function () {
                const book_id = this.getAttribute("data-book-id");

                if (!confirm("Are you sure you want to delete this book?")) {
                    return;
                }

                const formData = new FormData();
                formData.append("book_id", book_id);

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
