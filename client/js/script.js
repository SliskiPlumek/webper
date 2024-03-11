const fileInput = document.getElementById("fileInput");
const filesList = document.getElementById("fileList");

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
        return false;
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

      formData.append("files", file);
      filesArray.push(file);
      console.log(filesArray);
      handleFileElement(file);
    }
    return;
  }
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
  const firstParagraph = document.createElement("p");
  firstParagraph.textContent = `${filesArray.indexOf(file) + 1}. `;
  fileDiv.appendChild(firstParagraph);

  // Create and append the second paragraph with the file name
  const secondParagraph = document.createElement("p");
  secondParagraph.textContent = `${file.name}`;
  fileDiv.appendChild(secondParagraph);

  // Create and append the ion-icon for file removal
  const deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("name", "close-outline");
  deleteBtn.classList.add("remove-file-btn");
  deleteBtn.innerHTML = "✕";
  fileDiv.appendChild(deleteBtn);

  // Append the fileDiv to the desired container (e.g., body)
  filesList.appendChild(fileDiv);

  // Add an event listener to the ion-icon for removing the file
  deleteBtn.addEventListener("click", (e) => {
    const clickedElement = e.target;

    // Check if the clicked element has the 'remove-file-btn' class
    if (clickedElement.classList.contains("remove-file-btn")) {
      // Find the parent fileDiv element
      const fileDiv = clickedElement.closest(".file");

      // Get the data-file-id attribute value
      const fileId = fileDiv.getAttribute("data-file-id");

      // Remove the fileDiv from the DOM
      const fileElements = filesList?.getElementsByClassName("file");
      while (fileElements.length > 0) {
        filesList?.removeChild(fileElements[0]);
      }

      // Remove the corresponding file from the filesArray based on fileId
      const updatedFilesArray = filesArray.filter((file) => file.id !== fileId);
      filesArray = updatedFilesArray;

      filesArray.forEach((file) => {
        handleFileElement(file);
      });
    }
  });
}

fileInput.addEventListener("input", (e) => handleFiles(e));
