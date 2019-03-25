class Appareil
{
    constructor(nom, type, etage, x, y)
    {
        if(this.constructor == Appareil)
        {
            throw new Error("Appareil ne peut etre instancié")
        }
        else
        {
            this.nom = nom;
            this.type = type;
            this.options = {};
            this.etage = etage;
            this.locX = x;
            this.locY = y;
        }
    }

    getStatus()
    {
        throw new Error("getStatus() doit etre implémenté");
    }    

    getOptions(opName)
    {
        return this.options[opName];
    }

    setNewOptions(opName, opList)
    {
        this.options[opName] = opList;
    }

    setOption(opName, option)
    {
        throw new Error("setOption() doit etre implémenté");
    }
}

class Porte extends Appareil
{
    constructor(nom, etage, x, y)
    {
        super(nom, "Porte", etage, x, y);
        this.ouvert = false;
        this.setNewOptions("Ouvrir", []);
        this.setNewOptions("Fermer", []);
    }

    getStatus()
    {
        return this.ouvert ? "Ouverte" : "Fermée";
    }

    setOption(opName, option)
    {
        if(opName == "Ouvrir")
        {
            this.ouvert = true;
        }
        else if(opName == "Fermer")
        {
            this.ouvert = false;
        }
        else
        {
            throw new Error("L'option " + opName + " n'est pas définie");
        }
    }
}

class Fenetre extends Appareil
{
    constructor(nom, etage, x, y)
    {
        super(nom, "Fenetre", etage, x, y);
        this.ouvert = false;
        this.setNewOptions("Ouvrir", []);
        this.setNewOptions("Fermer", []);
    }

    getStatus()
    {
        return this.ouvert ? "Ouverte" : "Fermée";
    }

    setOption(opName, option)
    {
        if(opName == "Ouvrir")
        {
            this.ouvert = true;
        }
        else if(opName == "Fermer")
        {
            this.ouvert = false;
        }
        else
        {
            throw new Error("L'option " + opName + " n'est pas définie");
        }
    }
}


class TV extends Appareil
{
    constructor(nom, etage, x, y)
    {
        super(nom, "TV", etage, x, y);
        this.allumee = false;
        this.chaine = "TV0";
        this.volume = 0;
        this.setNewOptions("Allumer", []);
        this.setNewOptions("Eteindre", []);
        this.setNewOptions("Chaine", ["HDMI", "AV", "PC", "TV0", "TV1", "TV2", "TV3", "TV4", "TV5", "TV6", "TV7", "TV8", "TV9", "TV10", "TV11", "TV12"]);
        this.setNewOptions("Volume", ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"]);
    }

    getStatus()
    {
        return this.allumee ? ("Allumée. Chaine : " + this.chaine + ". Volume : " + this.volume) : "Eteinte";
    }

    setOption(opName, option)
    {
        if(opName == "Allumer")
        {
            this.allumee = true;
        }
        else if(opName == "Eteindre")
        {
            this.allumee = false;
        }
        else if(opName == "Chaine")
        {
            if(this.options[opName].indexOf(option) != -1)
            {
                this.chaine = option;
            }
            else
            {
                throw new Error("La chaine " + option + " n'est pas reconnue");
            }
        }
        else if(opName == "Volume")
        {
            if(this.options[opName].indexOf(option) != -1)
            {
                this.volume = parseInt(option);
            }
            else
            {
                throw new Error("Le volume " + option + " n'est pas défini");
            }
        }
        else
        {
            throw new Error("L'option " + opName + " n'est pas définie");
        }
    }
}


class Chauffage extends Appareil
{
    constructor(nom, etage, x, y)
    {
        super(nom, "Chauffage", etage, x, y);
        this.allume = false;
        this.temperature = 0;
        this.setNewOptions("Allumer", []);
        this.setNewOptions("Eteindre", []);
        this.setNewOptions("Temperature", ["15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25"]);
    }

    getStatus()
    {
        return this.allume ? ("Allumé. Temperature : " + this.temperature + "°C") : "Eteint";
    }

    setOption(opName, option)
    {
        if(opName == "Allumer")
        {
            this.allume = true;
        }
        else if(opName == "Eteindre")
        {
            this.allume = false;
        }
        else if(opName == "Temperature")
        {
            if(this.options[opName].indexOf(option) != -1)
            {
                this.temperature = parseInt(option);
            }
            else
            {
                throw new Error("La température " + option + " n'est pas valide");
            }
        }
        else
        {
            throw new Error("L'option " + opName + " n'est pas définie");
        }
    }
}