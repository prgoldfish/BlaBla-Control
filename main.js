// Variables globales du systèmes
let appareils = [];
let commandList = [];
let isOn = true;
let statusBusy = false;

window.addEventListener("load", () => {
    document.getElementById("OnOff").addEventListener("click", (e) => { // Event listener gérant le bouton on/off du menu
        isOn = !isOn;
        listeCommandes = document.getElementById("ListForm");
        for (const elt of listeCommandes.childNodes) {
            if(elt.tagName == "LI"){
                for (const child of elt.childNodes) {
                    if(child.tagName == "BUTTON" && child.id == "exec"){
                        child.disabled = !isOn;
                    }
                }
            }
        }
        document.getElementById("OnOffLabel").innerHTML = isOn ? "Désactiver le système" : "Activer le système";
        document.getElementById("OnOffSwitch").style.background = isOn ? "darkgreen" : "darkred";
        document.getElementById("OnOffHandle").style.background = isOn ? "green" : "red";
        document.getElementById("OnOffHandle").style.left = isOn ? "15px" : "-5px";
        document.getElementById("plan").style.filter = isOn ? "contrast(1)" : "contrast(0.5)";
        if(!statusBusy) displayStatus();
    });

    //Création d'appareils par défaut
    appareils.push(new Porte("Porte Chambre 1", 0, 370, 280));
    appareils.push(new Fenetre("Fenetre Chambre 2", 1, 180, 180));
    appareils.push(new TV("TV Salon", 0, 340, 150));
    appareils.push(new Chauffage("Chauffage Cellier", 0, 240, 325));

    for (const app of appareils) { // Ajout sur le plan
        addOnMap(app);        
    }
    initWindows(); // Initialisation des composants de la fenêtre interne
});

function displayStatus(){
    document.getElementById("statusMessage").innerHTML = isOn ? "Système activé" : "Système désactivé";
    statusBar = document.getElementById("statusBar");
    statusBar.style.background = isOn ? "linear-gradient(lightgreen, rgba(255,255,255,0))" : "linear-gradient(red, rgba(255,255,255,0))";
    statusBar.style.color = isOn ? "darkgreen" : "black";
    for(const elt of statusBar.childNodes){
        if(elt.className == "DownArrow"){
            elt.style.display = "none";
        }
    }
}

function addOnMap(app) { // Permet d'ajouter un point sur le plan représentant l'appareil
    let img = document.getElementById("etage" + app.etage); // On cherche le bon étage
    var div = document.createElement("div");
    div.className = "Point"
    div.style.top = app.locY + "px"; // On place le point
    div.style.left = app.locX + "px";
    switch (app.constructor.name) { // On choisit la couleur en fonction de son type
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
    let tooltip = document.createElement("div"); // Création d'un tooltip quand on passe la souris dessus
    div.addEventListener("mouseenter", () => { // Avec un event listener associé
        tooltip.innerHTML = "Nom : " + app.nom + "<br/>Type : " + app.type + "<br/>Statut : " + app.getStatus();
    });
    div.appendChild(tooltip);
    img.appendChild(div);
}

function initWindows() {
    let fen = document.getElementById("window"); // Fenêtre interne
    let close = document.getElementById("CloseButton"); // Bouton pour fermer la fenêtre interne
    let appTypes = [Porte, Fenetre, TV, Chauffage]; // Constructeurs des différents types d'appareils
    let forms = new Map(); // Récupération des différents formulaires disponibles
    forms.set("ajout", document.getElementById("AjoutForm"));
    forms.set("cList", document.getElementById("ListForm"));
    forms.set("addApp", document.getElementById("AppForm"));
    createSuggestionList(document.getElementById("suggestions")); // Création de la liste des suggestions

    // Lors du clic sur le bouton pour fermer la fenêtre interne
    close.addEventListener("click", () => { 
        document.getElementById("titre").innerHTML = ""; // On efface le titre
        fen.style.display = "none"; // On rend la fenêtre interne invisible
        for (const f of forms.values()) { // Ainsi que les formulaires
            f.style.display = "none";
        }
    });

    // Lors du clic sur "Associer un appareil" dans le menu
    document.getElementById("Associer").addEventListener("click", () => {
        if(fen.style.display != "block")
        {
            fen.style.display = "block"; // Affichage de la fenêtre interne
            forms.get("addApp").style.display = "block"; // Ainsi que du formulaire associé
            document.getElementById("titre").innerHTML = "Associer un appareil"; // On met à jour le titre
            document.getElementById("aType").innerHTML = ""; // On met à jour la liste des types d'appareils disponibles
            for (let i = 0; i < appTypes.length; i++) {
                document.getElementById("aType").innerHTML += "<option value=app" + i + ">" + appTypes[i].name + "</option>";
            }
        }
    });

    // Lors de l'appui sur le bouton pour placer un appareil sur le plan
    document.getElementById("placeApp").addEventListener("click", () => {
        if(document.getElementById("aName").value == "") // On vérifie qu'un nom a été rentré
        {
            alert("Veuillez donner un nom à l'appareil.");
            return;   
        }
        //afficher une instruction en haut de l'écran
        statusBusy = true;
        document.getElementById("statusMessage").innerHTML = "Veuillez placer l'appareil " + document.getElementById("aName").value + " sur le plan";
        statusBar = document.getElementById("statusBar");
        statusBar.style.background = "linear-gradient(yellow, rgba(255,255,255,0))";
        statusBar.style.color = "black";
        for(const elt of statusBar.childNodes){
            if(elt.className == "DownArrow"){
                elt.style.display = "inline-block";
            }
        }
        // On ferme la fenêtre interne afin de permettre à l'utilisateur de cliquer sur le plan
        close.click(); 
        let imgs = getEtagesImg(); // Récupérations des images des plans
        for (let i = 0; i < imgs.length; i++) {
            imgs[i].addEventListener("click", (ev) => {mapListen(ev, i, appTypes)});  // Ajout des listeners
        }
    });

    // Lors du clic sur "Liste des commandes" dans le menu
    document.getElementById("CommandList").addEventListener("click", () => {
        if(fen.style.display != "block")
        {
            fen.style.display = "block"; // Affichage de la fenêtre interne
            forms.get("cList").style.display = "block"; // Ainsi que du formulaire associé
            document.getElementById("titre").innerHTML = "Liste des commandes"; // On met à jour le titre
            initCommandList(document.getElementById("ListForm")); // On crée la liste des commandes
        }
    });

    // Lors du clic sur "Ajouter une commande" dans le menu 
    document.getElementById("Ajout").addEventListener("click", (e) => {
        if(fen.style.display != "block")
        {
            fen.style.display = "block"; // Affichage de la fenêtre interne
            forms.get("ajout").style.display = "block"; // Ainsi que du formulaire associé
            let appDropdown = document.getElementById("cApp");
            let actDropDown = document.getElementById("act");
            appDropdown.innerHTML = ""; // On met à jour la liste d'appareils
            for (let i = 0; i < appareils.length; i++) {
                appDropdown.innerHTML += "<option value=" + i + ">" + appareils[i].nom + "</option>";
                
            }
            document.getElementById("titre").innerHTML = "Créer une commande"; // On met à jour le titre
            let app = appareils[document.getElementById("cApp").value];
            actDropDown.innerHTML = ""; // On met à jour la liste des actions disponibles
            document.getElementById("actValue").style.display = "none";
            for (const act of Object.keys(app.options)) {
                actDropDown.innerHTML += "<option value=" + act + ">" + act + "</option>"
            }
        
        }        
    });

    //Lors de la sélection d'appareil lors de la création d'une commande
    document.getElementById("cApp").addEventListener("change", () => {
        let app = appareils[document.getElementById("cApp").value]; // On récupère l'appareil associé
        let actDropDown = document.getElementById("act");
        actDropDown.innerHTML = ""; // On vide le menu déroulant des actions disponibles
        document.getElementById("actValue").style.display = "none"; 
        for (const act of Object.keys(app.options)) { // Que l'on remplit ensuite des actions pertinentes à l'appareil
            actDropDown.innerHTML += "<option value=" + act + ">" + act + "</option>"
        }
    });

    // Lors de la sélection de type d'action lors de la création d'une commande
    document.getElementById("act").addEventListener("change", () => {
        let val = document.getElementById("act").value; // On récupère sa valeur
        let app = appareils[document.getElementById("cApp").value];
        let optionValues = app.getOptions(val); // On récupère les valeurs d'options disponibles pour cette action
        if(optionValues.length != 0) // S'il y en a
        {
            document.getElementById("actValue").style.display = "block"; // On affiche le second menu déroulant
            document.getElementById("actValue").innerHTML = "";
            for (const actVal of optionValues) { // Que l'on remplit
                document.getElementById("actValue").innerHTML += "<option value=" + actVal + ">" + actVal + "</option>"
            }
        }
        else // S'il y en a pas
        {
            document.getElementById("actValue").style.display = "none";
        }

    });

    // Lors du clic sur le bouton pour confirmer la création de la commande
    document.getElementById("createCommand").addEventListener("click", () => {
        if(document.getElementById("cName").value == "" ||
            document.getElementById("cText").value == "" ) // On vérifie si les champs sont bien remplis
        {
            alert("Veuillez remplir tous les champs.");
            return;   
        }        
        let conf = confirm("Voulez-vous créer la commande " + document.getElementById("cName").value + " ?");
        if(conf)
        {
            // On récupère les données rentrés
            let nom = document.getElementById("cName").value;
            let text = document.getElementById("cText").value;
            let app = appareils[document.getElementById("cApp").value];
            let optionName = document.getElementById("act").value;
            let optionValue = document.getElementById("actValue").value;

            // On crée la commande
            commandList.push(new Commande(nom, text, app, optionName, optionValue));
            close.click(); //Et on ferme la fenêtre
            alert("Commande créée");
        }
    });
    
}

function createSuggestionList(elmt) // Création de la liste des suggestions lors de la création d'une commande
{
    let suggestionList = ["Ouvrir", "Fermer", "Porte", "Fenêtre", "Allumer", "Eteindre", "Chaine", "Volume", "Télévision", "Température", "Chauffage"];
    let nbElts = 0;
    for (const sugg of suggestionList) {
        let s = document.createElement("span");
        s.innerHTML = sugg + " ";
        s.draggable = true;
        s.ondragstart = drag;
        elmt.appendChild(s);
        s.addEventListener("click", () => {
            document.getElementById("cText").value += s.innerHTML; // On ajoute le contenu de l'élément dans la zone de texte
        });
        nbElts++;
        if(nbElts >= 4){
            elmt.appendChild(document.createElement("br"))
            nbElts = 0;
        }
    }
}

// Fonctions pour permettre le drag and drop du texte lors de la création d'une commande

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

function initCommandList(list) // Création de la lste des commandes
{
    list.innerHTML = ""; //On vide ce qu'il y a précédemment
    for (let i = 0; i < commandList.length; i++) { //Pour chaque commande
        let li = document.createElement("li");
        let s = document.createElement("span"); //On ajoute le nom de la commande
        s.innerHTML = commandList[i].nom;
        li.appendChild(s);
        let exec = document.createElement("button"); // On ajoute un bouton pour exécuter la commande
        exec.innerHTML = "Exécuter";
        exec.type = "button";
        exec.disabled = !isOn;
        exec.id = "exec";
        exec.addEventListener("click", () => {
            if(isOn){
                commandList[i].doAction(); // Lance l'action de la commande à ses appareils associés
                alert("Commande exécutée");
            }
        });
        li.appendChild(exec);
        let suppr = document.createElement("button"); // On ajoute un bouton pour supprimer la commande
        suppr.innerHTML = "Supprimer";
        suppr.type = "button";
        suppr.addEventListener("click", () => {
            let nom = commandList[i].nom;
            if(confirm("Voulez-vous supprimer la commande " + nom + " ? Cette action est irréversible!")){
                commandList.splice(i, 1);
                initCommandList(list); // Si on supprime une commande, on recharge la liste
                alert("Commande " + nom + " supprimée avec succès");
            }
        });
        li.appendChild(suppr);
        list.appendChild(li);
    }
    if(list.innerHTML == "") //S'il n'y a pas de commandes
    {
        let li = document.createElement("li");
        li.innerHTML = "Aucune commande enregistrée.";
        list.appendChild(li);
    }
}

function getEtagesImg() { // Permet d'avoir les éléments HTML des images des plans
    let etages = document.getElementsByClassName("Etage");
    let imgs = [];
    for (let i = 0; i < etages.length; i++) {
        let noEtage = parseInt(etages[i].firstElementChild.id.replace("etage", "")); // On récupère le numéro de l'étage via l'id du noeud enfant sous la forme "etage1" 
        for (const elt of etages[i].firstElementChild.childNodes) {
            if(elt.tagName == "IMG") //On cherche le noeud img
            {
                imgs[noEtage] = elt;
                break; // On l'a trouvé, pas la peine de continuer
            }
        }        
    }
    return imgs;

}

function mapListen(ev, etage, appTypes) { //Listener permettant de selectionner l'emplacement de l'appareil sur le plan
    let x = ev.offsetX - 10; //On récupère les coordonnées x et y du clic par rapport à l'image
    let y = ev.offsetY - 10;
    let nom = document.getElementById("aName").value; //on récupère le nom de l'appareil
    let idApp = parseInt(document.getElementById("aType").value.replace("app", "")); 
    let appConstructor = appTypes[idApp]; // On récupère le constructeur de l'appareil
    let app = new appConstructor(nom, etage, x, y); // On crée l'appareil
    appareils.push(app); 
    addOnMap(app); // On l'ajoute sur le plan
    removeMapListeners(); // On enlève les listeners afin de ne pas ajouter plusieurs fois le même objet
    statusBusy = false;
    displayStatus();
    alert("L'appareil " + nom + " de type " + appConstructor.name + " a été ajouté avec succès");
}

function removeMapListeners() // Permet d'enlever les listeners créés lors du placement d'un appareil sur le plan 
{
    for (const img of getEtagesImg()) {
        let clone = img.cloneNode(true);
        img.parentNode.replaceChild(clone, img); // Cloner un élément enlève les listeners affiliés à l'élément.
    }
}