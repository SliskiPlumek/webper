const resizeBtn = document.getElementById("resize");
const convertBtn = document.getElementById("convert");

resizeBtn.addEventListener("click", () => {
  ipcRenderer.send("select-service", "resize");
});

convertBtn.addEventListener("click", () => {
  ipcRenderer.send("select-service", "convert");
});
