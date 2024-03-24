const fileInput = document.getElementById("fileInput");
const filesList = document.getElementById("fileList");
const convertSubmitBtn = document.getElementById("convertButton");

let filesArray = [];

function handleFiles() {
  console.log("handling files...");
  const files = fileInput.files;
  const formData = new FormData();

  if (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const existingSameFile = filesArray.some(
        (sameFile) => sameFile.name === file.name
      );

      if (existingSameFile) {
        console.log("Existing file!");
        console.log(filesArray);
        continue; // Continue to the next file if a file with the same name exists
      }

      const fileId = generateFileId();
      file.id = fileId;

      const allowedFormats = [
        "image/jpeg", // .jpeg
        "image/png", // .png
        "image/avif", // .avif
        "image/gif", // .gif
        "image/jpg", // .jpg
      ];

      if (!allowedFormats.includes(file.type)) {
        alert(
          `Nie prawidłowy format pliku: ${file.name}. Wybierz poprawny format lub zapakuj plik do .zip.`
        );
        fileInput.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          const width = img.naturalWidth;
          const height = img.naturalHeight;
          console.log("Width:", width);
          console.log("Height:", height);
          // Now you can set the width and height input values or do whatever you want with them
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);

      formData.append("files", file);
      filesArray.push(file);
      console.log(filesArray);
      handleFileElement(file);
    }
  }
}

async function submitConvert() {
  console.log(filesArray);

  // Notify the main process to start the conversion
  filesArray.forEach((file) => {
    ipcRenderer.send("submit-convert", file.path);
  });

  // Listen for the conversion completion event from the main process
  ipcRenderer.on("convert-complete", () => {
    console.log("File conversion complete!");
    // Additional logic to handle conversion completion in the renderer process
  });
}

function generateFileId() {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 1000);
  return `file_${timestamp}_${randomNum}`;
}

function handleFileElement(file) {
  const fileDiv = document.createElement("div");
  fileDiv.classList.add("file");
  fileDiv.setAttribute("data-file-id", file.id);

  // Create and append the first paragraph
  const numberParagraph = document.createElement("p");
  numberParagraph.textContent = `${filesArray.indexOf(file) + 1}. `;
  fileDiv.appendChild(numberParagraph);

  // Create and append the second paragraph with the file name
  const nameParagraph = document.createElement("p");
  nameParagraph.textContent = `${file.name}`;
  fileDiv.appendChild(nameParagraph);

  const widthLabel = document.createElement('label')
  widthLabel.setAttribute("for", "width")
  widthLabel.textContent = 'w:'
  fileDiv.appendChild(widthLabel)
  
  // Create and append input elements for width and height
  const widthInput = document.createElement("input");
  widthInput.setAttribute("type", "number");
  widthInput.setAttribute("name", "width");
  widthInput.classList.add("dimension-input");
  fileDiv.appendChild(widthInput);
  
  const separatingParagraph = document.createElement("p")
  fileDiv.appendChild(separatingParagraph)

  const heightLabel = document.createElement('label')
  heightLabel.setAttribute("for", "height")
  heightLabel.textContent = 'h:'
  fileDiv.appendChild(heightLabel)

  const heightInput = document.createElement("input");
  heightInput.setAttribute("type", "number");
  heightInput.setAttribute("name", "height");
  heightInput.classList.add("dimension-input");
  fileDiv.appendChild(heightInput);

  // Create and append the ion-icon for file removal
  const deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("name", "close-outline");
  deleteBtn.classList.add("remove-file-btn");
  deleteBtn.innerHTML = "✕";
  fileDiv.appendChild(deleteBtn);

  // Append the fileDiv to the desired container
  filesList.appendChild(fileDiv);

  // Add an event listener to the delete button for removing the file
  deleteBtn.addEventListener("click", (e) => {
    const clickedElement = e.target;

    // Check if the clicked element has the 'remove-file-btn' class
    if (clickedElement.classList.contains("remove-file-btn")) {
      // Find the parent fileDiv element
      const fileDiv = clickedElement.closest(".file");

      // Get the data-file-id attribute value
      const fileId = fileDiv.getAttribute("data-file-id");

      // Remove the fileDiv from the DOM
      filesList.removeChild(fileDiv);

      // Remove the corresponding file from the filesArray based on fileId
      const updatedFilesArray = filesArray.filter((file) => file.id !== fileId);
      filesArray = updatedFilesArray;

      // Update file number paragraphs
      const fileElements = document.querySelectorAll(".file");
      fileElements.forEach((fileDiv, index) => {
        const numberParagraph = fileDiv.querySelector("p");
        numberParagraph.textContent = `${index + 1}. `;
      });
    }
  });
}

fileInput.addEventListener("input", (e) => handleFiles(e));
convertSubmitBtn.addEventListener("click", (e) => submitConvert(e));