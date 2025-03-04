document.getElementById('save-button').addEventListener('click', function() {
    const moduleName = document.querySelector('input[placeholder="Module Name"]').value;
    const moduleDescription = document.querySelector('input[placeholder="Description"]').value;
    const moduleImage = document.getElementById('module-preview').src;
    const moduleStatus = document.querySelector('select').value;

    if (moduleName && moduleDescription && moduleImage) {
        const modulesList = document.getElementById('modules-list');
        const newRow = document.createElement('tr');

        newRow.innerHTML = `
            <td>${moduleName}</td>
            <td>${moduleDescription}</td>
            <td><img src="${moduleImage}" alt="Module Cover" style="width: 50px; height: auto;"></td>
            <td>${moduleStatus}</td>
            <td><button class="edit-button">Edit</button> <button class="delete-button">Delete</button></td>
        `;

        modulesList.appendChild(newRow);
        alert('Module added successfully!'); // Feedback for the user

        // Clear input fields after adding
        document.querySelector('input[placeholder="Module Name"]').value = '';
        document.querySelector('input[placeholder="Description"]').value = '';
        document.getElementById('module-preview').src = '#';
        document.querySelector('select').value = 'available';
    } else {
        alert('Please fill in all fields before saving.'); // Validation
    }
});

// Function to preview the image
function previewImage(event, previewId) {
    const reader = new FileReader();
    reader.onload = function() {
        const img = document.getElementById(previewId);
        img.src = reader.result;
        img.style.display = 'block'; // Show the image
    }
    reader.readAsDataURL(event.target.files[0]);
}