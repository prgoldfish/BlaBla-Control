let appareils = [];
let commandList = [];
let isOn = true;

window.addEventListener("load", () => {
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
    let appTypes = [Porte, Fenetre, TV, Chauffage];
    let forms = new Map();
    forms.set("ajout", document.getElementById("AjoutForm"));
    forms.set("cList", document.getElementById("ListForm"));
    forms.set("addApp", document.getElementById("AppForm"));
    createSuggestionList(document.getElementById("suggestions"));

    // Bouton pour fermer la fenêtre
    close.addEventListener("click", () => { 
        document.getElementById("titre").innerHTML = "";
        fen.style.display = "none";
        for (const f of forms.values()) {
            f.style.display = "none";
        }
    });

    // Ajout d'un appareil
    document.getElementById("Associer").addEventListener("click", () => {
        if(fen.style.display != "block")
        {
            fen.style.display = "block";
            forms.get("addApp").style.display = "block";
            document.getElementById("titre").innerHTML = "Associer un appareil";
            document.getElementById("aType").innerHTML = "";
            for (let i = 0; i < appTypes.length; i++) {
                document.getElementById("aType").innerHTML += "<option value=app" + i + ">" + appTypes[i].name + "</option>";
            }
        }
    });

    // Placement de l'appareil
    document.getElementById("placeApp").addEventListener("click", () => {
        if(document.getElementById("aName").value == "")
        {
            alert("Veuillez donner un nom à l'appareil.");
            return;   
        } 
        document.getElementById("message").innerHTML = "Veuillez placer l'appareil " + document.getElementById("aName").value + " sur le plan";
        close.click();
        let imgs = getEtagesImg();
        console.log(imgs);
        for (let i = 0; i < imgs.length; i++) {
            imgs[i].addEventListener("click", (ev) => {mapListen(ev, i, appTypes)});            
        }
    });

    // Affichage de la liste des commandes
    document.getElementById("CommandList").addEventListener("click", () => {
        if(fen.style.display != "block")
        {
            fen.style.display = "block";
            forms.get("cList").style.display = "block";
            document.getElementById("titre").innerHTML = "Liste des commandes";
            initCommandList(document.getElementById("ListForm"));
        }
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
            for (const actVal of optionValues) {
                document.getElementById("actValue").innerHTML += "<option value=" + actVal + ">" + actVal + "</option>"
            }
        }
        else
        {
            document.getElementById("actValue").style.display = "none";
        }

    });

    // Confirmation de la création de la commande
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
    });
    
}

function createSuggestionList(elmt)
{
    let suggestionList = ["Ouvrir", "Fermer", "Allumer", "Eteindre", "Volume", "Température", "Chaine"];
    for (const sugg of suggestionList) {
        let s = document.createElement("span");
        s.innerHTML = sugg + " ";
        s.draggable = true;
        s.ondragstart = drag;
        elmt.appendChild(s);
        s.addEventListener("click", () => {
            document.getElementById("cText").value += s.innerHTML;
        });
        
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("Text", ev.target.innerHTML);
}

function drop(ev) {
    let data = ev.dataTransfer.getData("Text");
    ev.target.value += data; 

    ev.preventDefault();
}

function initCommandList(list)
{
    list.innerHTML = "";
    for (let i = 0; i < commandList.length; i++) {
        let li = document.createElement("li");
        let s = document.createElement("span");
        s.innerHTML = commandList[i].nom;
        li.appendChild(s);
        let exec = document.createElement("button");
        exec.innerHTML = "Exécuter";
        exec.type = "button";
        exec.addEventListener("click", () => {
            commandList[i].doAction();
            alert("Commande exécutée avec succès");
        });
        li.appendChild(exec);
        let suppr = document.createElement("button");
        suppr.innerHTML = "Supprimer";
        suppr.type = "button";
        suppr.addEventListener("click", () => {
            let nom = commandList[i].nom;
            commandList.splice(i, 1);
            initCommandList(list); // Si on supprime une commande, on recharge la liste
            alert("Commande " + nom + " supprimée avec succès");
        });
        li.appendChild(suppr);
        list.appendChild(li);
    }
    if(list.innerHTML == "")
    {
        let li = document.createElement("li");
        li.innerHTML = "Aucune commande de créée.";
        list.appendChild(li);
    }
}

function getEtagesImg() {
    let etages = document.getElementsByClassName("Etage");
    let imgs = [];
    for (let i = 0; i < etages.length; i++) {
        let noEtage = parseInt(etages[i].firstElementChild.id.replace("etage", ""));
        for (const elt of etages[i].firstElementChild.childNodes) {
            if(elt.tagName == "IMG")
            {
                imgs[noEtage] = elt;
                break;
            }
        }        
    }
    return imgs;

}

function mapListen(ev, etage, appTypes) {
    let x = ev.offsetX;
    let y = ev.offsetY;
    let nom = document.getElementById("aName").value;
    let idApp = parseInt(document.getElementById("aType").value.replace("app", ""));
    let appConstructor = appTypes[idApp];
    let app = new appConstructor(nom, etage, x, y);
    appareils.push(app);
    addOnMap(app);
    removeMapListeners();
    document.getElementById("message").innerHTML = "";
    alert("L'appareil " + nom + " de type " + appConstructor.name + "a été créé avec succès");
}

function removeMapListeners()
{

    for (const img of getEtagesImg()) {
        let clone = img.cloneNode(true);
        img.parentNode.replaceChild(clone, img); // Cloner un élément enlève les listeners affiliés à l'élément.
    }
}