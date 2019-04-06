class Commande
{
    constructor(nom, text, appareil, optionName, optionValue)
    {
        this.nom = nom;
        this.text  = text;
        this.appareils = [appareil];
        this.action = new Action(optionName, optionValue);
    }

    ajoutAppareil(appareil)
    {
        if(appareil.constructor.name == appareils[0].constructor.name)
        {
            appareils.push(appareil);
        }
        else
        {
            throw new Error("L'appareil n'est pas du type " + appareils[0].constructor.name);
        }
    }

    doAction()
    {
        for (const app of this.appareils) 
        {
            app.setOption(this.action.optionName, this.action.optionValue);   
        }
    }
}

class Action
{
    constructor(optionName, optionValue)
    {
        this.optionName = optionName;
        this.optionValue = optionValue;
    }
}