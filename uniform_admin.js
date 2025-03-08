document.addEventListener("DOMContentLoaded", function () {
    console.log("Uniforms JS loaded!");

    const uniformForm = document.getElementById("uniform-form");
    const uniformNameInput = document.getElementById("uniformname");
    const uniformImageInput = document.getElementById("uniformimage");
    const uniformStatSelect = document.getElementById("uniformstat");
    const previewImage = document.getElementById("uniform-preview");
    const uniformsList = document.getElementById("uniforms-list");
    
    loadUniforms(); // Load uniforms when the page loads

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
        updateStatusColor(); // Run initially
    }

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

    uniformForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!validateForm()) {
            return;
        }
        const formData = new FormData(uniformForm);
        fetch("http://localhost/UPBooktrack/upload_uniforms.php", {
            method: "POST",
            body: formData,
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            uniformForm.reset();
            previewImage.style.display = "none";
            updateStatusColor();
            loadUniforms();
        })
        .catch(error => console.error("Error:", error));
    });

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
                        </select>
                    </td>
                    <td><input type="text" class="edit-name" value="${uniform.uniformname}" disabled></td>
                    <td><textarea class="edit-desc" disabled>${uniform.uniformdesc}</textarea></td>
                    <td><img src="${uniform.uniformimage}" alt="Uniform Image" style="width: 150px; height: auto;"></td>
                    
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
                        <button class="edit-button" data-id="${uniform.id}">Edit</button>
                        <button class="save-button" data-id="${uniform.id}" style="display:none;">Save</button>
                        <button class="delete-button" data-id="${uniform.id}">Delete</button>
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
                const id = this.getAttribute("data-id");
                const uniformcollege = row.querySelector(".edit-college").value;
                const uniformname = row.querySelector(".edit-name").value;
                const uniformdesc = row.querySelector(".edit-desc").value;
                const uniformsize = row.querySelector(".edit-size").value;
                const uniformgender = row.querySelector(".edit-gender").value;
                const uniformstock = row.querySelector(".edit-stock").value;
                const uniformstat = row.querySelector(".uniform-status").value;

                const formData = new FormData();
                formData.append("id", id);
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
                    alert("Uniform updated successfully!");
                    loadUniforms();
                } else {
                    alert("Failed to update uniform.");
                }
            });
        });

        document.querySelectorAll(".delete-button").forEach(button => {
            button.addEventListener("click", async function () {
                const id = this.getAttribute("data-id");
        
                if (!confirm("Are you sure you want to delete this uniform?")) {
                    return;
                }
        
                const formData = new FormData();
                formData.append("id", id);
        
                try {
                    const response = await fetch("http://localhost/UPBooktrack/delete_uniform.php", {
                        method: "POST",
                        body: formData
                    });
        
                    const result = await response.json();
        
                    if (result.status === "success") {
                        showNotification("uniform deleted successfully!", "success");
                        
                        // Call loadBooks immediately to refresh the table
                        loadBooks();
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
