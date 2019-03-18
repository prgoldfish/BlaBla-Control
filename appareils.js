class Appareil
{
    constructor(nom, type)
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
    constructor(nom)
    {
        super(nom, "Porte");
        this.ouvert = false;
        this.setNewOptions("Ouvrir", []);
        this.setNewOptions("Fermer", []);
    }

    getStatus()
    {
        return this.ouvert ? "Ouvert" : "Fermé";
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