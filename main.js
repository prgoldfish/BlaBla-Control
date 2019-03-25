window.addEventListener("load", () => {
    let isOn = true;
    document.getElementById("OnOff").addEventListener("click", (e) => {
        e.target.innerHTML = isOn ? "Activer le système" : "Désactiver le système";
        isOn = !isOn;
    });
});