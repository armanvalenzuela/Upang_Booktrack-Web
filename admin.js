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