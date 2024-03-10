const resizeBtn = document.getElementById("resize") || null;
const convertBtn = document.getElementById("convert") || null;
const goBackBtn = document.getElementById('goBackButton') || null;

resizeBtn?.addEventListener("click", () => {
  ipcRenderer.send("select-service", "resize");
});

convertBtn?.addEventListener("click", () => {
  ipcRenderer.send("select-service", "convert");
});

goBackBtn?.addEventListener('click', () => {
  ipcRenderer.send("select-service", "menu")
})
