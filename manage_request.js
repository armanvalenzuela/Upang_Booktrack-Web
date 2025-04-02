let bookRequests = [];
let uniformRequests = [];

// FETCH REQUESTS USING PHP
fetch("http://localhost/UPBooktrack/admin_get_requests.php")
    .then(response => response.json())
    .then(data => {
        bookRequests = data.book_requests;
        uniformRequests = data.uniform_requests;

        // Default sorting: Sort by request_count (largest first)
        bookRequests.sort((a, b) => parseInt(b.request_count, 10) - parseInt(a.request_count, 10));
        uniformRequests.sort((a, b) => parseInt(b.request_count, 10) - parseInt(a.request_count, 10));

        renderBookTable(bookRequests);
        renderUniformTable(uniformRequests);
    })
    .catch(error => console.error("Error fetching requests:", error));

// SET REQUESTS FOR BOOKS
function renderBookTable(data) {
    const tableBody = document.querySelector("#book-requests-body");
    tableBody.innerHTML = "";

    data.forEach((request, index) => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td class="short-column">${index + 1}</td>
            <td class="short-column">${request.bookcollege}</td>
            <td class="wide-column">${request.bookname}</td>
            <td class="short-column">${request.request_count}</td>
            <td class="short-column">
                <button class="action-btn approve" data-request-id="${request.book_id}" data-type="book">✓</button>
            </td>
        `;
        tableBody.appendChild(newRow);
    });
}

// SET REQUESTS FOR UNIFORMS
function renderUniformTable(data) {
    const tableBody = document.querySelector("#uniform-requests-body");
    tableBody.innerHTML = "";

    data.forEach((request, index) => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${index + 1}</td>
            <td>${request.uniformcollege}</td>
            <td>${request.uniformname}</td>
            <td>${request.uniformgender}</td>
            <td>${request.uniformsize}</td>
            <td>${request.request_count}</td>
            <td>
                <button class="action-btn approve" data-request-id="${request.uniform_id}" data-type="uniform">✓</button>
            </td>
        `;
        tableBody.appendChild(newRow);
    });
}

// SORTING FUNCT
function sortTable(column, order, type) {
    let sortedData = type === "book" ? [...bookRequests] : [...uniformRequests];

    if (column === "request_count") {
        sortedData.sort((a, b) => order === "asc" ? a.request_count - b.request_count : b.request_count - a.request_count);
    } else if (column === "bookname" || column === "uniformname") {
        sortedData.sort((a, b) => order === "asc" ? a[column].localeCompare(b[column]) : b[column].localeCompare(a[column]));
    }

    type === "book" ? renderBookTable(sortedData) : renderUniformTable(sortedData);
}

// SORTING FUNCT
function filterUniformTable() {
    let selects = document.querySelectorAll(".requests-uniform select.header-select");
    let department = selects[0].value;
    let nameSort = selects[1].value;
    let gender = selects[2].value;
    let size = selects[3].value;
    let requestSort = selects[4].value;

    let filteredData = uniformRequests.filter(request =>
        (department === "" || request.uniformcollege === department) &&
        (gender === "" || request.uniformgender === gender) &&
        (size === "" || request.uniformsize === size)
    );

    // APPLY SORTING
    if (nameSort) {
        filteredData.sort((a, b) => nameSort === "asc" ? a.uniformname.localeCompare(b.uniformname) : b.uniformname.localeCompare(a.uniformname));
    }
    if (requestSort) {
        filteredData.sort((a, b) => requestSort === "asc" ? a.request_count - b.request_count : b.request_count - a.request_count);
    }

    renderUniformTable(filteredData);
}

// SORTING FUNCT FOR BOOKS
function filterBookTable() {
    let department = document.querySelector("#book-filter").value;
    let nameSort = document.querySelector("#book-sort").value;
    let requestSort = document.querySelector("#book-sort-requests").value;

    let filteredData = bookRequests.filter(request =>
        (department === "" || request.bookcollege === department)
    );

    // APPLY SORT
    if (nameSort) {
        filteredData.sort((a, b) => nameSort === "asc" ? a.bookname.localeCompare(b.bookname) : b.bookname.localeCompare(a.bookname));
    }
    if (requestSort) {
        filteredData.sort((a, b) => requestSort === "asc" ? a.request_count - b.request_count : b.request_count - a.request_count);
    }

    renderBookTable(filteredData);
}

// EVENT LISTENERS FOR SORTING
document.querySelector("#book-filter").addEventListener("change", filterBookTable);
document.querySelector("#book-sort").addEventListener("change", filterBookTable);
document.querySelector("#book-sort-requests").addEventListener("change", filterBookTable);

document.querySelectorAll(".requests-uniform select.header-select").forEach(select => {
    select.addEventListener("change", filterUniformTable);
});

// REQUEST APPROVAL
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("approve")) {
        let requestId = event.target.getAttribute("data-request-id");
        let type = event.target.getAttribute("data-type");

        if (confirm("Are you sure you want to fulfill this request?")) {
            fetch("http://localhost/UPBooktrack/admin_fulfill_request.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `request_id=${requestId}&type=${type}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Request fulfilled!");
                    event.target.closest("tr").remove(); // REMOVE ROW AFTER APPROVED
                } else {
                    alert("Error: " + data.message);
                }
            })
            .catch(error => console.error("Error fulfilling request:", error));
        }
    }
});
