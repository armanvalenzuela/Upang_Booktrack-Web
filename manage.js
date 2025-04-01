document.addEventListener('DOMContentLoaded', async function () {
    const requestList = document.getElementById('request-list');
    const searchInput = document.getElementById('searchInput');
    const collegeFilter = document.getElementById('college-filter');

    // Fetch all users from database
    async function fetchUsers() {
        try {
            const response = await fetch('http://localhost/UPBooktrack/admin_fetch_users.php');
            const users = await response.json();

            if (!Array.isArray(users)) {
                throw new Error("Invalid response format");
            }

            displayUsers(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            requestList.innerHTML = "<tr><td colspan='7'>Failed to load users</td></tr>";
        }
    }

    // Display users in table
    function displayUsers(users) {
        requestList.innerHTML = '';

        if (users.length === 0) {
            requestList.innerHTML = "<tr><td colspan='7'>No users found</td></tr>";
            return;
        }

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="text" class="edit-studentNo" value="${user.studentNo}" disabled></td>
                <td><input type="text" class="edit-name" value="${user.studentName}" disabled></td>
                <td>
                    <select class="edit-gender" disabled>
                        <option value="male" ${user.gender === "male" ? "selected" : ""}>Male</option>
                        <option value="female" ${user.gender === "female" ? "selected" : ""}>Female</option>
                    </select>
                </td>
                <td>
                    <select class="edit-college" disabled>
                        <option value="CITE" ${user.college === "CITE" ? "selected" : ""}>CITE</option>
                        <option value="CMA" ${user.college === "CMA" ? "selected" : ""}>CMA</option>
                        <option value="CAHS" ${user.college === "CAHS" ? "selected" : ""}>CAHS</option>
                        <option value="CEA" ${user.college === "CEA" ? "selected" : ""}>CEA</option>
                        <option value="CCJE" ${user.college === "CCJE" ? "selected" : ""}>CCJE</option>
                        <option value="CAS" ${user.college === "CAS" ? "selected" : ""}>CAS</option>
                        <option value="SHS" ${user.college === "SHS" ? "selected" : ""}>SHS</option>
                    </select>
                </td>
                <td><input type="email" class="edit-email" value="${user.email}" disabled></td>
                <td>
                    <div class="password-container">
                        <input type="password" class="edit-password" placeholder="Enter new password" disabled>
                        <button type="button" class="toggle-password" onclick="togglePassword(this)">👁</button>
                    </div>
                </td>
                <td class="action-buttons">
                    <button class="edit-btn" onclick="editUser(this, '${user.id}')">Edit</button>
                    <button class="save-btn" onclick="saveUser(this, '${user.id}')" style="display: none;">Save</button>
                    <button class="delete-btn" onclick="deleteUser('${user.id}')">Delete</button>
                </td>
            `;
            requestList.appendChild(row);
        });
    }

    // Toggle password visibility
    window.togglePassword = function (button) {
        const input = button.previousElementSibling;
        if (input.type === "password") {
            input.type = "text";
        } else {
            input.type = "password";
        }
    };

    // Initial fetch
    await fetchUsers();

    // College filter functionality
    if (collegeFilter) {
        collegeFilter.addEventListener("change", filterTableByCollege);
    }

    function filterTableByCollege() {
        const selectedCollege = collegeFilter.value.toLowerCase();

        document.querySelectorAll("#request-list tr").forEach(row => {
            const collegeSelect = row.querySelector(".edit-college");
            if (!collegeSelect) return;
            
            const college = collegeSelect.value.toLowerCase();
            
            if (!selectedCollege) {
                row.style.display = "";
                return;
            }

            row.style.display = college === selectedCollege ? "" : "none";
        });
    }

    // Initial fetch
    await fetchUsers();
});

// Enable editing for a user row
function editUser(button, userId) {
    const row = button.closest('tr');

    // Enable all editable fields
    row.querySelector('.edit-studentNo').disabled = false;
    row.querySelector('.edit-name').disabled = false;
    row.querySelector('.edit-gender').disabled = false;
    row.querySelector('.edit-college').disabled = false;
    row.querySelector('.edit-email').disabled = false;
    row.querySelector('.edit-password').disabled = false;

    // Toggle button visibility
    button.style.display = "none";
    row.querySelector('.save-btn').style.display = "inline-block";
}

// Save user changes
async function saveUser(button, userId) {
    const row = button.closest('tr');

    // Get all field values
    const studentNo = row.querySelector('.edit-studentNo').value;
    const studentName = row.querySelector('.edit-name').value;
    const gender = row.querySelector('.edit-gender').value;
    const college = row.querySelector('.edit-college').value;
    const email = row.querySelector('.edit-email').value;
    const newPassword = row.querySelector('.edit-password').value;

    // Validate required fields
    if (!studentNo || !studentName || !gender || !college || !email) {
        showNotification("All fields except password are required!", "error");
        return;
    }

    // Validate password length if provided
    if (newPassword && newPassword.length < 6) {
        showNotification("Password must be at least 6 characters", "error");
        return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("id", userId);
    formData.append("studentNo", studentNo);
    formData.append("studentName", studentName);
    formData.append("gender", gender);
    formData.append("college", college);
    formData.append("email", email);
    
    // Only include password if changed
    if (newPassword) {
        formData.append("newPassword", newPassword);
    }

    try {
        const response = await fetch("http://localhost/UPBooktrack/update_user.php", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (result.status === "success") {
            showNotification("User updated successfully!", "success");
            setTimeout(() => location.reload(), 1500);
        } else {
            showNotification(result.message || "Failed to update user.", "error");
        }
    } catch (error) {
        showNotification("Error updating user!", "error");
        console.error(error);
    }
}

// Delete a user
async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        return;
    }

    const formData = new FormData();
    formData.append("id", userId);

    try {
        const response = await fetch("http://localhost/UPBooktrack/delete_user.php", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (result.status === "success") {
            showNotification("User deleted successfully!", "success");
            setTimeout(() => location.reload(), 1500);
        } else {
            showNotification(result.message || "Failed to delete user.", "error");
        }
    } catch (error) {
        showNotification("Error deleting user!", "error");
        console.error(error);
    }
}

// Show notification message
function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = "0";
        setTimeout(() => notification.remove(), 500);
    }, 1000);
}