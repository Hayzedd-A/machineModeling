const dropArea = $('#dropArea');
const fileInput = $('#fileInput');
const previewImage = $('#previewImage');

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.on(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight the drop area when dragging over
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.on(eventName, highlight, false);
});
['dragleave', 'drop'].forEach(eventName => {
    dropArea.on(eventName, unhighlight, false);
});

// Handle dropped files
dropArea.on('drop', handleDrop, false);

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight() {
    dropArea.addClass('highlight');
}

function unhighlight() {
    dropArea.removeClass('highlight');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    handleFiles(files);
}

function handleFiles(files) {
    const file = files[0];

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewImage.show();
        };

        reader.readAsDataURL(file);
    }
}

// Open the file input when clicking on the drop area
dropArea.on('click', () => {
    fileInput.click();
});

// Handle file input change event
fileInput.on('change', () => {
    const file = fileInput.files[0];
    handleFiles([file]);
});
 
