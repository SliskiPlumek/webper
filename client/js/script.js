document.getElementById('fileInput').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const files = event.target.files;
    const fileList = document.getElementById('fileList');

    fileList.innerHTML = '';

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileBox = document.createElement('div');
        fileBox.classList.add('fileBox');

        const fileName = document.createElement('div');
        fileName.classList.add('fileName');
        fileName.textContent = file.name;

        const removeButton = document.createElement('button');
        removeButton.classList.add('removeButton');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => removeFile(i));

        fileBox.appendChild(fileName);
        fileBox.appendChild(removeButton);

        fileList.appendChild(fileBox);
    }
}

function removeFile(index) {
    const fileInput = document.getElementById('fileInput');
    const files = Array.from(fileInput.files);
    files.splice(index, 1);
    fileInput.files = new FileList({ length: files.length, item: (i) => files[i] });

    handleFileSelect({ target: { files } });
}

document.getElementById('convertButton').addEventListener('click', convertFiles);

function convertFiles() {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;

    // Implement your logic for file conversion here

    alert('Files converted successfully!');
}
