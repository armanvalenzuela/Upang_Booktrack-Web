document.getElementById('save-button').addEventListener('click', function() {
    const uniformName = document.querySelector('input[placeholder="Uniform Name"]').value;
    const uniformImage = document.getElementById('uniform-preview').src;
    const uniformSize = document.querySelector('input[placeholder="Size (e.g., S, M, L)"]').value;
    const uniformStatus = document.querySelector('select').value;

    if (uniformName && uniformImage && uniformSize) {
        const uniformsList = document.getElementById('uniforms-list');
        const newRow = document.createElement('tr');

        newRow.innerHTML = `
            <td>${uniformName}</td>
            <td><img src="${uniformImage}" alt="Uniform Cover" style="width: 50px; height: auto;"></td>
            <td>${uniformSize}</td>
            <td>${uniformStatus}</td>
            <td><button class="edit-button">Edit</button> <button class="delete-button">Delete</button></td>
        `;

        uniformsList.appendChild(newRow);
        alert('Uniform added successfully!'); // Feedback for the user

        // Clear input fields after adding
        document.querySelector('input[placeholder="Uniform Name"]').value = '';
        document.getElementById('uniform-preview').src = '#';
        document.querySelector('input[placeholder="Size (e.g., S, M, L)"]').value = '';
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