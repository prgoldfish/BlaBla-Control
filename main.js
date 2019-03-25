window.addEventListener("load", () => {
    let isOn = true;
    document.getElementById("OnOff").addEventListener("click", (e) => {
        e.target.innerHTML = isOn ? "Activer le système" : "Désactiver le système";
        isOn = !isOn;
    });

    let appareils = [];
    appareils.push(new Porte("Chambre 1", 0, 100, 100));
    appareils.push(new Fenetre("Chambre 2", 1, 0, 0));
    appareils.push(new TV("Salon", 0, 0, 100));
    appareils.push(new Chauffage("Cellier", 0, 100, 0));

    for (const app of appareils) {
        addOnMap(app);        
    }


});


function addOnMap(app) {
    let img = document.getElementById("etage" + app.etage);
    //console.log(app);
    var div = document.createElement("div");
    div.className = "Point"
    div.style.top = app.locY + "px";
    div.style.left = app.locX + "px";
    switch (app.constructor.name) {
        case "Porte":
            div.style.background = "green";
            break;
        case "Fenetre":
            div.style.background = "pink";
            break;
        case "TV":
            div.style.background = "blue";
            break;
        case "Chauffage":
            div.style.background = "red";
            break;
    
        default:
            div.style.background = "magenta";
            break;
    }
    img.appendChild(div);
}