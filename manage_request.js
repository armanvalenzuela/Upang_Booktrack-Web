let bookRequests = [];
let uniformRequests = [];

// Fetch requests from PHP
fetch("http://localhost/UPBooktrack/admin_get_requests.php")
    .then(response => response.json())
    .then(data => {
        // Store both books and uniforms data
        bookRequests = data.book_requests;
        uniformRequests = data.uniform_requests;

        // Default sorting: Sort by request_count (largest first)
        bookRequests.sort((a, b) => parseInt(b.request_count, 10) - parseInt(a.request_count, 10));
        uniformRequests.sort((a, b) => parseInt(b.request_count, 10) - parseInt(a.request_count, 10));

        // Render both tables
        renderBookTable(bookRequests);
        renderUniformTable(uniformRequests);
    })
    .catch(error => console.error("Error fetching requests:", error));

// Function to render Book Requests table
function renderBookTable(data) {
    const tableBody = document.querySelector("#book-requests-body");
    tableBody.innerHTML = ""; // Clear table

    data.forEach((request, index) => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${index + 1}</td>
            <td>${request.bookcollege}</td>
            <td>${request.bookname}</td>
            <td>${request.request_count}</td>
            <td>
                <button class="action-btn approve" data-request-id="${request.book_req_id}">✓</button>
            </td>
        `;
        tableBody.appendChild(newRow);
    });
}

// Function to render Uniform Requests table
function renderUniformTable(data) {
    const tableBody = document.querySelector("#uniform-requests-body");
    tableBody.innerHTML = ""; // Clear table

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
                <button class="action-btn approve" data-request-id="${request.unif_req_id}">✓</button>
            </td>
        `;
        tableBody.appendChild(newRow);
    });
}

// Sorting function (separate for books and uniforms)
function sortTable(column, order, type) {
    let sortedData = type === "book" ? [...bookRequests] : [...uniformRequests];

    if (column === "request_count") {
        sortedData.sort((a, b) => {
            let countA = parseInt(a.request_count, 10);
            let countB = parseInt(b.request_count, 10);
            return order === "asc" ? countA - countB : countB - countA;
        });
    } else if (column === "bookname" || column === "uniformname") {
        sortedData.sort((a, b) => order === "asc" ? a[column].localeCompare(b[column]) : b[column].localeCompare(a[column]));
    }

    type === "book" ? renderBookTable(sortedData) : renderUniformTable(sortedData);
}

// Filtering functions (separate for books and uniforms)
function filterBookTable(department) {
    let filteredData = department ? bookRequests.filter(request => request.bookcollege === department) : bookRequests;
    renderBookTable(filteredData);
}

function filterUniformTable(department) {
    let filteredData = department ? uniformRequests.filter(request => request.uniformcollege === department) : uniformRequests;
    renderUniformTable(filteredData);
}

// Event listeners for books
document.querySelector("#book-filter").addEventListener("change", (event) => {
    filterBookTable(event.target.value);
});

document.querySelector("#book-sort").addEventListener("change", (event) => {
    sortTable("bookname", event.target.value, "book");
});

document.querySelector("#book-sort-requests").addEventListener("change", (event) => {
    sortTable("request_count", event.target.value, "book");
});

// Event listeners for uniforms
document.querySelector("#uniform-filter").addEventListener("change", (event) => {
    filterUniformTable(event.target.value);
});

document.querySelector("#uniform-sort").addEventListener("change", (event) => {
    sortTable("uniformname", event.target.value, "uniform");
});

document.querySelector("#uniform-sort-requests").addEventListener("change", (event) => {
    sortTable("request_count", event.target.value, "uniform");
});
