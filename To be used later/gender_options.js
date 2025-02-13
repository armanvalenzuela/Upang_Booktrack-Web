function selectGender(selectedRadio) {
    // Remove "selected" class from all labels
    document.querySelectorAll(".radio-label").forEach(label => {
        label.classList.remove("selected");
    });

    // Add "selected" class to the clicked label
    selectedRadio.parentElement.classList.add("selected");
}
