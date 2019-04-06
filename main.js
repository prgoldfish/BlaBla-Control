let appareils = [];
let commandList = [];

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
    appareils.push(new Porte("Porte Chambre 1", 0, 370, 280));
    appareils.push(new Fenetre("Fenetre Chambre 2", 1, 180, 180));
    appareils.push(new TV("TV Salon", 0, 340, 150));
    appareils.push(new Chauffage("Chauffage Cellier", 0, 240, 325));

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
    let forms = new Map();
    forms.set("ajout", document.getElementById("AjoutForm"));

    // Bouton pour fermer la fenêtre
    close.addEventListener("click", () => { 
        document.getElementById("titre").innerHTML = "";
        fen.style.display = "none";
        for (const f of forms.values()) {
            f.style.display = "none";
        } 
        console.log("Close");       
    });

    // Ajout d'une commande
    document.getElementById("Ajout").addEventListener("click", (e) => {
        if(fen.style.display != "block")
        {
            fen.style.display = "block";
            forms.get("ajout").style.display = "block";
            let appDropdown = document.getElementById("cApp");
            let actDropDown = document.getElementById("act");
            appDropdown.innerHTML = "";
            for (let i = 0; i < appareils.length; i++) {
                appDropdown.innerHTML += "<option value=" + i + ">" + appareils[i].nom + "</option>";
                
            }
            document.getElementById("titre").innerHTML = "Créer une commande";
            let app = appareils[document.getElementById("cApp").value];
            actDropDown.innerHTML = "";
            document.getElementById("actValue").style.display = "none";
            for (const act of Object.keys(app.options)) {
                actDropDown.innerHTML += "<option value=" + act + ">" + act + "</option>"
            }
        
        }        
    });

    //Lors du changement d'appareil
    document.getElementById("cApp").addEventListener("change", () => {
        let app = appareils[document.getElementById("cApp").value];
        let actDropDown = document.getElementById("act");
        actDropDown.innerHTML = "";
        document.getElementById("actValue").style.display = "none";
        for (const act of Object.keys(app.options)) {
            actDropDown.innerHTML += "<option value=" + act + ">" + act + "</option>"
        }
    });

    // Lors du changement d'action
    document.getElementById("act").addEventListener("change", () => {
        let val = document.getElementById("act").value;
        let app = appareils[document.getElementById("cApp").value];
        let optionValues = app.getOptions(val);
        if(optionValues != [])
        {
            document.getElementById("actValue").style.display = "block";
            document.getElementById("actValue").innerHTML = "";
            console.log(optionValues);
            for (const actVal of optionValues) {
                document.getElementById("actValue").innerHTML += "<option value=" + actVal + ">" + actVal + "</option>"
            }
        }
        else
        {
            document.getElementById("actValue").style.display = "none";
        }

    });

    document.getElementById("createCommand").addEventListener("click", () => {
        if(document.getElementById("cName").value == "" ||
            document.getElementById("cText").value == "" )
        {
            alert("Veuillez remplir tous les champs.");
            return;   
        }        
        let conf = confirm("Voulez-vous créer la commande " + document.getElementById("cName").value + " ?");
        if(conf)
        {
            let nom = document.getElementById("cName").value;
            let text = document.getElementById("cText").value;
            let app = appareils[document.getElementById("cApp").value];
            let optionName = document.getElementById("act").value;
            let optionValue = document.getElementById("actValue").value;
            commandList.push(new Commande(nom, text, app, optionName, optionValue));
            close.click();
            alert("Commande créée");

        }
    })
    
}
