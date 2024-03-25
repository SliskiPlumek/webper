const fileInput = document.getElementById("fileInput");
const filesList = document.getElementById("fileList");
const convertSubmitBtn = document.getElementById("convertButton");

let filesArray = [];
let width;
let height;

function handleFiles() {
  const files = fileInput.files;
  const formData = new FormData();

  if (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const existingSameFile = filesArray.some(
        (sameFile) => sameFile.name === file.name
      );

      if (existingSameFile) {
        continue;
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
      reader.onload = function async(e) {
        const img = new Image();
        img.onload = function () {
          file.width = img.naturalWidth;
          file.height = img.naturalHeight;
          formData.append("files", file);
          filesArray.push(file);
          handleFileElement(file);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}

async function submitConvert() {
  filesArray.forEach((file) => {
    const fileData = {
      path: file.path,
      width: file.width,
      height: file.height,
    };
    ipcRenderer.send("submit-convert", fileData);
  });

  ipcRenderer.on("convert-complete", () => {
    fileInput.value = "";
    const fileDivElements = document.querySelectorAll(".file");
    filesArray = [];
    fileDivElements.forEach((elemnet) => elemnet.remove());
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

  const numberParagraph = document.createElement("p");
  numberParagraph.textContent = `${filesArray.indexOf(file) + 1}. `;
  fileDiv.appendChild(numberParagraph);

  const nameParagraph = document.createElement("p");
  nameParagraph.textContent = `${file.name}`;
  fileDiv.appendChild(nameParagraph);

  const widthLabel = document.createElement("label");
  widthLabel.setAttribute("for", "width");
  widthLabel.textContent = "w:";
  fileDiv.appendChild(widthLabel);

  const widthInput = document.createElement("input");
  widthInput.setAttribute("type", "number");
  widthInput.setAttribute("name", "width");
  widthInput.classList.add("dimension-input");
  fileDiv.appendChild(widthInput);
  widthInput.value = file.width;

  const separatingParagraph = document.createElement("p");
  fileDiv.appendChild(separatingParagraph);

  const heightLabel = document.createElement("label");
  heightLabel.setAttribute("for", "height");
  heightLabel.textContent = "h:";
  fileDiv.appendChild(heightLabel);

  const heightInput = document.createElement("input");
  heightInput.setAttribute("type", "number");
  heightInput.setAttribute("name", "height");
  heightInput.classList.add("dimension-input");
  fileDiv.appendChild(heightInput);
  heightInput.value = file.height;


  const deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("name", "close-outline");
  deleteBtn.classList.add("remove-file-btn");
  deleteBtn.innerHTML = "✕";
  fileDiv.appendChild(deleteBtn);

  filesList.appendChild(fileDiv);

  deleteBtn.addEventListener("click", (e) => {
    const clickedElement = e.target;

    if (clickedElement.classList.contains("remove-file-btn")) {
      const fileDiv = clickedElement.closest(".file");
      const fileId = fileDiv.getAttribute("data-file-id");

      filesList.removeChild(fileDiv);

      const updatedFilesArray = filesArray.filter((file) => file.id !== fileId);
      filesArray = updatedFilesArray;

      const fileElements = document.querySelectorAll(".file");
      fileElements.forEach((fileDiv, index) => {
        const numberParagraph = fileDiv.querySelector("p");
        numberParagraph.textContent = `${index + 1}. `;
      });
    }
  });
  widthInput.addEventListener("input", (e) => {
    file.width = parseInt(e.target.value);
  });

  heightInput.addEventListener("input", (e) => {
    file.height = parseInt(e.target.value);
  });
}

fileInput.addEventListener("input", (e) => handleFiles(e));
convertSubmitBtn.addEventListener("click", (e) => submitConvert(e));
