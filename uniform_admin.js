document.addEventListener("DOMContentLoaded", function () {
    console.log("Uniforms JS loaded!");

    const uniformForm = document.getElementById("uniform-form");
    const uniformNameInput = document.getElementById("uniformname");
    const uniformImageInput = document.getElementById("uniformimage");
    const uniformStatSelect = document.getElementById("uniformstat");
    const previewImage = document.getElementById("uniform-preview");
    const uniformsList = document.getElementById("uniforms-list");
    
    loadUniforms(); // RUN FUNCT AS PAGE LOADS

    function updateStatusColor() {
        if (uniformStatSelect.value === "available") {
            uniformStatSelect.style.backgroundColor = "darkgreen";
            uniformStatSelect.style.color = "white";
        } else {
            uniformStatSelect.style.backgroundColor = "darkred";
            uniformStatSelect.style.color = "white";
        }
    }
    
    if (uniformStatSelect) {
        uniformStatSelect.addEventListener("change", updateStatusColor);
        updateStatusColor();
    }

    //PREVIEW IMAGE FILE WHEN UPLOADING
    function previewImageFile(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                previewImage.src = e.target.result;
                previewImage.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    }
    uniformImageInput.addEventListener("change", previewImageFile);

    function validateForm() {
        if (!uniformNameInput.value.trim()) {
            alert("Please enter a uniform name.");
            return false;
        }
        if (!uniformImageInput.files.length) {
            alert("Please select an image.");
            return false;
        }
        const file = uniformImageInput.files[0];
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            alert("Invalid file type. Please upload an image (JPG, PNG, GIF). ");
            return false;
        }
        return true;
    }

    //UNIFORM UPLOAD
    uniformForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        if (!validateForm()) {
            return;
        }
    
        const formData = new FormData(uniformForm);
    
        try {
            const response = await fetch("http://localhost/UPBooktrack/upload_uniforms.php", {
                method: "POST",
                body: formData,
            });
    
            const result = await response.text();
            console.log("Server Response:", result);
    
            if (result.includes("success")) {
                showNotification("Uniform uploaded successfully!", "success");
                loadUniforms();
                uniformForm.reset();
                previewImage.style.display = "none";
                updateStatusColor();
            } else {
                showNotification(result, "error");
            }
        } catch (error) {
            console.error("Error:", error);
            showNotification("Upload failed. Please try again!", "error");
        }
    });
    
    // NOTIFICATION FUNCT
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

    //SEARCH FUNCTIONALITY
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const searchTerm = this.value.toLowerCase();

            document.querySelectorAll("#uniforms-list tr").forEach(row => {
                const rowText = Array.from(row.querySelectorAll("td"))
                    .map(td => {
                        const input = td.querySelector("input, select, textarea");
                        return input ? (input.value || input.options?.[input.selectedIndex]?.text || '') : td.textContent;
                    })
                    .join(" ")
                    .toLowerCase();

                row.style.display = rowText.includes(searchTerm) ? "" : "none";
            });
        });
    }

    // Add this after the search functionality
    const departmentFilter = document.getElementById("department-filter");

    if (departmentFilter) {
        departmentFilter.addEventListener("change", filterTableByDepartment);
    }

    function filterTableByDepartment() {
        const selectedDepartment = departmentFilter.value.toLowerCase();

        document.querySelectorAll("#uniforms-list tr").forEach(row => {
            // Show all rows if "Department" is selected (empty value)
            if (!selectedDepartment) {
                row.style.display = "";
                return;
            }

            const department = row.querySelector(".edit-college").value.toLowerCase();
            row.style.display = department === selectedDepartment ? "" : "none";
        });
    }

    //FETCH ALL UNIFORM DATA FROM DB AND SORT THEM INTO TABLE
    async function loadUniforms() {
        try {
            const response = await fetch("http://localhost/UPBooktrack/fetch_uniforms.php");
            const uniforms = await response.json();
            uniformsList.innerHTML = "";

            if (uniforms.length === 0) {
                uniformsList.innerHTML = "<tr><td colspan='6'>No uniforms found</td></tr>";
                return;
            }

            uniforms.forEach(uniform => {
                const newRow = document.createElement("tr");
                newRow.innerHTML = `
                    <td>
                        <select class="edit-college" disabled>
                            <option value="CITE" ${uniform.uniformcollege === "CITE" ? "selected" : ""}>CITE</option>
                            <option value="CMA" ${uniform.uniformcollege === "CMA" ? "selected" : ""}>CMA</option>
                            <option value="CAHS" ${uniform.uniformcollege === "CAHS" ? "selected" : ""}>CAHS</option>
                            <option value="CEA" ${uniform.uniformcollege === "CEA" ? "selected" : ""}>CEA</option>
                            <option value="CAS" ${uniform.uniformcollege === "CAS" ? "selected" : ""}>CAS</option>
                            <option value="SHS" ${uniform.uniformcollege === "SHS" ? "selected" : ""}>SHS</option>
                        </select>
                    </td>
                    <td><input type="text" class="edit-name" value="${uniform.uniformname}" disabled></td>
                    <td><textarea class="edit-desc" disabled>${uniform.uniformdesc}</textarea></td>
                    <td><img src="${uniform.uniformimage}" alt="Uniform Image" style="width: 200px; height: 200px;"></td>
                    
                    <td>
                        <select class="edit-size" disabled>
                            <option value="XS" ${uniform.uniformsize === "XS" ? "selected" : ""}>XS</option>
                            <option value="S" ${uniform.uniformsize === "S" ? "selected" : ""}>S</option>
                            <option value="M" ${uniform.uniformsize === "M" ? "selected" : ""}>M</option>
                            <option value="L" ${uniform.uniformsize === "L" ? "selected" : ""}>L</option>
                            <option value="XL" ${uniform.uniformsize === "XL" ? "selected" : ""}>XL</option>
                        </select>
                    </td>
                    
                    <td>
                        <select class="edit-gender" disabled>
                            <option value="Male" ${uniform.uniformgender === "Male" ? "selected" : ""}>Male</option>
                            <option value="Female" ${uniform.uniformgender === "Female" ? "selected" : ""}>Female</option>
                        </select>
                    </td>
                    <td><input type="number" class="edit-stock" value="${uniform.uniformstock}" disabled></td>
                    <td>
                        <select class="uniform-status" disabled>
                            <option value="available" ${uniform.uniformstat === "available" ? "selected" : ""}>Available</option>
                            <option value="not-available" ${uniform.uniformstat === "not-available" ? "selected" : ""}>Not Available</option>
                        </select>
                    </td>
                    <td>
                        <button class="edit-button" data-id="${uniform.uniform_id}">Edit</button>
                        <button class="save-button" data-id="${uniform.uniform_id}" style="display:none;">Save</button>
                        <button class="delete-button" data-id="${uniform.uniform_id}">Delete</button>
                    </td>
                `;
                uniformsList.appendChild(newRow);
            });

            document.querySelectorAll(".uniform-status").forEach(select => {
                updateDropdownColor(select);
                select.addEventListener("change", function () {
                    updateDropdownColor(this);
                });
            });
            attachEventListeners();
        } catch (error) {
            console.error("Error fetching uniforms:", error);
        }
    }

    //UPDATE DROPDOWN COLOR BASED ON SELECTED OPTION
    function updateDropdownColor(select) {
        if (select.value === "available") {
            select.style.backgroundColor = "darkgreen";
            select.style.color = "white";
        } else {
            select.style.backgroundColor = "darkred";
            select.style.color = "white";
        }
    }

    //EDIT FUNCTION
    function attachEventListeners() {
        document.querySelectorAll(".edit-button").forEach(button => {
            button.addEventListener("click", function () {
                const row = this.closest("tr");
                row.querySelector(".edit-name").disabled = false;
                row.querySelector(".edit-desc").disabled = false;
                row.querySelector(".edit-stock").disabled = false;
                row.querySelector(".uniform-status").disabled = false;
                this.style.display = "none";
                row.querySelector(".save-button").style.display = "inline-block";
            });
        });

        document.querySelectorAll(".save-button").forEach(button => {
            button.addEventListener("click", async function () {
                const row = this.closest("tr");
                const uniform_id = this.getAttribute("data-id"); // Updated
                const uniformcollege = row.querySelector(".edit-college").value;
                const uniformname = row.querySelector(".edit-name").value;
                const uniformdesc = row.querySelector(".edit-desc").value;
                const uniformsize = row.querySelector(".edit-size").value;
                const uniformgender = row.querySelector(".edit-gender").value;
                const uniformstock = row.querySelector(".edit-stock").value.trim();
                const uniformstat = row.querySelector(".uniform-status").value;
        
                if (uniformstock === "") {
                    showNotification("Stock cannot be empty!", "error");
                    return;
                }
        
                const formData = new FormData();
                formData.append("uniform_id", uniform_id); // Updated
                formData.append("uniformcollege", uniformcollege);
                formData.append("uniformname", uniformname);
                formData.append("uniformdesc", uniformdesc);
                formData.append("uniformsize", uniformsize);
                formData.append("uniformgender", uniformgender);
                formData.append("uniformstock", uniformstock);
                formData.append("uniformstat", uniformstat);
        
                const response = await fetch("http://localhost/UPBooktrack/update_uniform.php", {
                    method: "POST",
                    body: formData
                });
        
                const result = await response.text();
                if (result.includes("success")) {
                    showNotification("Uniform updated successfully!", "success");
                    loadUniforms();
                } else {
                    showNotification("Failed to update uniform.", "error");
                }
            });
        });

        //DELETE FUNCTION
        document.querySelectorAll(".delete-button").forEach(button => {
            button.addEventListener("click", async function () {
                const uniform_id = this.getAttribute("data-id"); // Change 'id' to 'uniform_id'
        
                if (!confirm("Are you sure you want to delete this uniform?")) {
                    return;
                }
        
                const formData = new FormData();
                formData.append("uniform_id", uniform_id); // Change 'id' to 'uniform_id'
        
                try {
                    const response = await fetch("http://localhost/UPBooktrack/delete_uniform.php", {
                        method: "POST",
                        body: formData
                    });
        
                    const result = await response.json();

            if (result.status === "success") {
                showNotification("Uniform deleted successfully!", "success");
                
                // Reload the page after a short delay to show notification
                setTimeout(() => {
                    location.reload();
                }, 1000); // Reload after 1 second
            } else {
                showNotification("Failed to delete uniform: " + result.message, "error");
            }
        } catch (error) {
            console.error("Error deleting uniform:", error);
            showNotification("Error deleting uniform.", "error");
        }
    });
});     
    }
});
