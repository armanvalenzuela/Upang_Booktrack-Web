document.addEventListener('DOMContentLoaded', function() {
    // Sample data - Replace this with your actual data fetching logic
    const sampleRequests = [
        {
            no: "1",
            profile: "User Profile",
            email: "user@example.com",
            password: "********"
        },
        // Add more sample data as needed
    ];

    function displayRequests(requests) {
        const requestList = document.getElementById('request-list');
        requestList.innerHTML = '';

        requests.forEach(request => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${request.no}</td>
                <td>${request.profile}</td>
                <td>${request.email}</td>
                <td>${request.password}</td>
                <td class="action-buttons">
                    <button class="edit-btn" onclick="editRequest('${request.no}')">Edit</button>
                    <button class="delete-btn" onclick="deleteRequest('${request.no}')">Delete</button>
                </td>
            `;
            requestList.appendChild(row);
        });
    }

    // Initial display
    displayRequests(sampleRequests);

    // Add search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredRequests = sampleRequests.filter(request => 
            request.profile.toLowerCase().includes(searchTerm) ||
            request.email.toLowerCase().includes(searchTerm)
        );
        displayRequests(filteredRequests);
    });
});

// Function to edit request
function editRequest(requestId) {
    // Add your edit logic here
    console.log(`Editing request ${requestId}`);
}

// Function to delete request
function deleteRequest(requestId) {
    // Add your delete logic here
    console.log(`Deleting request ${requestId}`);
    if (confirm('Are you sure you want to delete this request?')) {
        // Add deletion logic here
        console.log(`Request ${requestId} deleted`);
    }
}
