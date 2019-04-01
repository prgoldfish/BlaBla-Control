let appareils = [];

window.addEventListener("load", () => {
    let isOn = true;
    document.getElementById("OnOff").addEventListener("click", (e) => {
        isOn = !isOn;
        document.getElementById("OnOffLabel").innerHTML = isOn ? "Désactiver le système" : "Activer le système";
        document.getElementById("OnOffSwitch").style.background = isOn ? "darkgreen" : "darkred";
        document.getElementById("OnOffHandle").style.background = isOn ? "green" : "red";
        document.getElementById("OnOffHandle").style.left = isOn ? "15px" : "-5px";
        document.getElementById("plan").style.filter = isOn ? "contrast(1)" : "contrast(0.5)";
    });

    //let appareils = [];
    appareils.push(new Porte("Chambre 1", 0, 370, 280));
    appareils.push(new Fenetre("Chambre 2", 1, 180, 180));
    appareils.push(new TV("Salon", 0, 340, 150));
    appareils.push(new Chauffage("Cellier", 0, 240, 325));

    for (const app of appareils) {
        addOnMap(app);        
    }
    initWindows();


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
    //div.innerHTML = "<div>informations sur l'appareil</div>"
    let tooltip = document.createElement("div");
    div.addEventListener("mouseenter", () => {
        tooltip.innerHTML = "Nom : " + app.nom + "<br/>Type : " + app.type + "<br/>Statut : " + app.getStatus();
    });
    div.appendChild(tooltip);
    img.appendChild(div);
}

function initWindows() {
    let fen = document.getElementById("window");
    let close = document.getElementById("CloseButton");

    close.addEventListener("click", () => {
        let inWindow = fen.firstElementChild;
        while(inWindow.hasChildNodes())
        {
            inWindow.removeChild(inWindow.firstChild);
        }
        inWindow.appendChild(close);
        console.log("Hey");
        fen.style.display = "none";
        
    });

    document.getElementById("Ajout").addEventListener("click", (e) => {
        if(fen.style.display != "block")
        {
            fen.style.display = "block";
            createCommandWindow(fen);
        }
        
        
    });
}

function createCommandWindow(fen) {
    let inWindow = fen.firstElementChild;
    let title = document.createElement("h1");
    let form = document.createElement("form");
    let commandName = document.createElement("div");
    let commandText = document.createElement("div");
    title.innerHTML = "Créer une commande";
    commandName.innerHTML = "<label for=\"cName\">Nom de la commande  </label>";
    commandName.innerHTML += "<input type=\"text\" id=\"cName\"/><br/>";
    commandText.innerHTML = "<label for=\"cText\">Commande  </label>";
    commandText.innerHTML += "<textarea id=\"cText\"></textarea><br/>";
    form.appendChild(commandName);
    form.appendChild(commandText);
    inWindow.appendChild(title);
    inWindow.appendChild(form);
    fen.appendChild(inWindow);
}