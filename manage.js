document.addEventListener('DOMContentLoaded', async function () {
    const requestList = document.getElementById('request-list');
    const searchInput = document.getElementById('searchInput');

    //RETRIEVS ALL USERS FROM DB
    async function fetchUsers() {
        try {
            const response = await fetch('http://localhost/UPBooktrack/fetch_users.php');
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

    // DYNAMIC USER INFO DISPLAY (YUNG TABLE)
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
                    </select>
                </td>
                <td><input type="email" class="edit-email" value="${user.email}" disabled></td>
                <td>
                    <span class="password-text" style="display: none;">${user.password}</span>
                    <button class="showpass-btn" onclick="togglePassword(this)">Show</button>
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

    // SEARCH FUNCTIONALITY
    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
    
        document.querySelectorAll('#request-list tr').forEach(row => {
            const rowText = Array.from(row.querySelectorAll('td'))
                .map(td => {
                    // Get value from input/select or text from td
                    const input = td.querySelector('input, select');
                    return input ? (input.value || input.options?.[input.selectedIndex]?.text || '') : td.textContent;
                })
                .join(" ")
                .toLowerCase();
    
            row.style.display = rowText.includes(searchTerm) ? '' : 'none';
        });
    });

    await fetchUsers(); //FETCH ALL ON PAGE LOAD
});

// PASSWORD VISIBILITY TOGGLE
function togglePassword(button) {
    const passwordText = button.previousElementSibling;
    if (passwordText.style.display === "none") {
        passwordText.style.display = "inline";
        button.textContent = "Hide";
    } else {
        passwordText.style.display = "none";
        button.textContent = "Show";
    }
}

// EDITING FUNCTION (BASED ON SET ID)
function editUser(button, userId) {
    const row = button.closest('tr');

    row.querySelector('.edit-studentNo').disabled = false;
    row.querySelector('.edit-name').disabled = false;
    row.querySelector('.edit-gender').disabled = false;
    row.querySelector('.edit-college').disabled = false;
    row.querySelector('.edit-email').disabled = false;

    button.style.display = "none";
    row.querySelector('.save-btn').style.display = "inline-block";
}

// SAVE EDIT
async function saveUser(button, userId) {
    const row = button.closest('tr');

    const studentNo = row.querySelector('.edit-studentNo').value;
    const studentName = row.querySelector('.edit-name').value;
    const gender = row.querySelector('.edit-gender').value;
    const college = row.querySelector('.edit-college').value;
    const email = row.querySelector('.edit-email').value;

    if (!studentNo || !studentName || !gender || !college || !email) {
        showNotification("All fields are required!", "error");
        return;
    }

    const formData = new FormData();
    formData.append("id", userId);
    formData.append("studentNo", studentNo);
    formData.append("studentName", studentName);
    formData.append("gender", gender);
    formData.append("college", college);
    formData.append("email", email);

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

// DELETE FUNCTION
async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) {
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

// NOTIFICATIONS
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
