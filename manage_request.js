let bookRequests = [];
let uniformRequests = [];

// Fetch requests from PHP
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

// Function to render Book Requests table (UNCHANGED)
function renderBookTable(data) {
    const tableBody = document.querySelector("#book-requests-body");
    tableBody.innerHTML = "";

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
                <button class="action-btn approve" data-request-id="${request.unif_req_id}">✓</button>
            </td>
        `;
        tableBody.appendChild(newRow);
    });
}

// Sorting function (Books & Uniforms Separate)
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

// Filtering function for Uniform Table
function filterUniformTable() {
    let selects = document.querySelectorAll(".requests-uniform select.header-select");
    let department = selects[0].value;
    let nameSort = selects[1].value;
    let gender = selects[2].value;
    let size = selects[3].value;
    let requestSort = selects[4].value;

    let filteredData = uniformRequests.filter(request => {
        return (
            (department === "" || request.uniformcollege === department) &&
            (gender === "" || request.uniformgender === gender) &&
            (size === "" || request.uniformsize === size)
        );
    });

    if (nameSort) {
        filteredData.sort((a, b) => nameSort === "asc" ? a.uniformname.localeCompare(b.uniformname) : b.uniformname.localeCompare(a.uniformname));
    }

    if (requestSort) {
        filteredData.sort((a, b) => requestSort === "asc" ? a.request_count - b.request_count : b.request_count - a.request_count);
    }

    renderUniformTable(filteredData);
}

// Filtering function for Books (UNCHANGED)
function filterBookTable() {
    let department = document.querySelector("#book-filter").value;
    let filteredData = department ? bookRequests.filter(request => request.bookcollege === department) : bookRequests;
    renderBookTable(filteredData);
}

// Event Listeners for Books (UNCHANGED)
document.querySelector("#book-filter").addEventListener("change", filterBookTable);
document.querySelector("#book-sort").addEventListener("change", (event) => {
    sortTable("bookname", event.target.value, "book");
});
document.querySelector("#book-sort-requests").addEventListener("change", (event) => {
    sortTable("request_count", event.target.value, "book");
});

// Event Listeners for Uniforms (Using Selects Instead of IDs)
document.querySelectorAll(".requests-uniform select.header-select").forEach(select => {
    select.addEventListener("change", filterUniformTable);
});
