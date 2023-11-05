const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');
const previewImage = document.getElementById('previewImage');
let file = '';

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight the drop area when dragging over
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});
['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight() {
    dropArea.classList.add('highlight');
}

function unhighlight() {
    dropArea.classList.remove('highlight');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    handleFiles(files);
}

function handleFiles(files) {
    file = files[0];

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
            $('.button').css('display', 'flex')
        };

        reader.readAsDataURL(file);
    }
}

// Open the file input when clicking on the drop area
dropArea.addEventListener('click', () => {
    fileInput.click();
});

// Handle file input change event
fileInput.addEventListener('change', () => {
    const files = fileInput.files[0];
    handleFiles([files]);
});

function loadResponse(result) {
  $responseImg = $('<img>', {
    src: $('#previewImage').attr('src')
  })
  $responseDiv = $('<div>', {
    html: "<span>" +result+ "</span>",
    class: 'responseItem'
  })

  $responseDiv.append($responseImg)
  $responseDiv.appendTo($('.samples'))

  previewImage.style.display = 'none';
  $('.button svg').hide();
  $('.button').hide()

}
 
// HTML: <input type="file" id="fileInput">

// const fileInput = document.getElementById('fileInput');
// fileInput.addEventListener('change', async function() {
//   const file = fileInput.files[0];
$('.button').click(async function() {
  if (file) {
    console.log('submitting to API')
    $('.button svg').show();
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('https://multi-class-fruit.onrender.com/predict', {
        method: 'POST',
        body: formData,
      });

      $('.button svg').hide();

      if (response.ok) {
        const responseData = await response.json();
        loadResponse(responseData)
        console.log('API Response:', responseData);
      } else {
        console.error('API Error:', response.statusText);
      }
    } catch (error) {
      console.error('Network Error:', error);
    }
  }
});
