function previewImage(event, previewId) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const img = document.getElementById(previewId);
        img.src = e.target.result;
        img.style.display = 'block'; // Show the image
    }
    
    if (file) {
        reader.readAsDataURL(file);
    }
}

document.getElementById('save-button').addEventListener('click', function() {
    alert('Changes saved successfully!'); // Placeholder for save functionality
    // Here you can add code to actually save the changes, e.g., sending data to a server
});

document.getElementById('save-button').addEventListener('click', function() {
    const bookName = document.querySelector('.itemsearch').value;
    const bookImage = document.getElementById('book-preview').src;
    const bookStatus = document.querySelector('select').value;

    if (bookName && bookImage) {
        const booksList = document.getElementById('books-list');
        const newRow = document.createElement('tr');

        newRow.innerHTML = `
            <td>${bookName}</td>
            <td><img src="${bookImage}" alt="Book Cover" style="width: 50px; height: auto;"></td>
            <td>${bookStatus}</td>
            <td><button class="edit-button">Edit</button> <button class="delete-button">Delete</button></td>
        `;

        booksList.appendChild(newRow);
        alert('Book added successfully!'); // Feedback for the user
    } else {
        alert('Please fill in all fields before saving.'); // Validation
    }
});