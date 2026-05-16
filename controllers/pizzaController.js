const menu = require('../data/menu');


function index(req, res) {
    let filteredMenu = menu;
    const ingredient = req.query.ingredient;
    if (ingredient) {
        filteredMenu = menu.filter(pizza => {
            return pizza.ingredients.includes(ingredient);
        })
    }
    /**
     * Spiegazione della differenza tra 
     * 1) copia del solo contenitore  -> filter O map
     * 2) copia ANCHE del contenuto   -> filter + map con spread operator
    

    CASO 1:
        const newMenu = filteredMenu.filter(pizza => {
    
            return pizza.id > 1;
        })
    
        console.log(newMenu)
    
        for (let pizza of newMenu) {
            pizza.name = pizza.name + "_ciao"
        }
    

    CASO 2:
        const menuTwo = filteredMenu.filter(pizza => {
            return pizza.id > 1
        }).map(pizza => ({ ...pizza, name: pizza.name + "_addio" }))
    
     */
    res.json(filteredMenu);
}

function show(req, res) {
    const { id } = req.params;

    const filter = menu.find(pizza => {
        return pizza.id == parseInt(id)
    })

    if (!filter) {
        res.status(404)
        res.json({
            error: "Not found",
            message: "Pizza non trovata"
        })
    }

    res.json(filter)

}

function store(req, res) {
    console.log("Body ricevuto: ", req.body)
    // Creiamo un nuovo id incrementando l'ultimo id presente
    const newId = menu[menu.length - 1].id + 1;

    // Creiamo un nuovo oggetto pizza
    const newPizza = {
        id: newId,
        name: req.body.name,
        image: req.body.image,
        ingredients: req.body.ingredients
    }

    menu.push(newPizza)

    res.status(201)
    res.json(newPizza)

}

function update(req, res) {
    /*
    * 1) recuperare l'elemento con id passato come parametro dinamico
    *
    * IF elemento esiste
    *   2) modifichiamo i campi dell'elemento trovato con i dati del body
    * 
    *   3) ritorniamo il nuovo elemento
    * 
    * ELSE -> elemento NON esiste
    *   2) ritorniamo un errore con 404
    */

    const elemento = menu.find(pizza => {
        return pizza.id == parseInt(req.params.id)
    })

    if (elemento) {
        elemento.image = req.body.image;
        elemento.name = req.body.name;
        elemento.ingredients = req.body.ingredients;

        res.status(200)
        res.json(elemento)
    } else {
        res.status(404);
        res.json({
            success: false,
            message: "Nessuna pizza con id " + req.params.id + " trovata"
        })
    }
}

function modify(req, res) {
    const elemento = menu.find(pizza => {
        return pizza.id == parseInt(req.params.id)
    })

    if (elemento) {
        elemento.image = req.body.image;
        elemento.name = req.body.name;
        elemento.ingredients = req.body.ingredients;

        res.status(200)
        res.json(elemento)
    } else {
        res.status(404);
        res.json({
            success: false,
            message: "Nessuna pizza con id " + req.params.id + " trovata"
        })
    }
}

function destroy(req, res) {
    const filter = menu.find(pizza => {
        return pizza.id == parseInt(req.params.id)
    })

    if (filter) {
        menu.splice(menu.indexOf(filter), 1)

        res.status(200)
        res.json({
            success: true,
            message: "Pizza eliminata con successo"
        })
    } else {
        res.status(404)
        res.json({
            success: false,
            message: "Non esiste una pizza con questo id"
        })
    }
}

// esportiamo tutto
module.exports = { index, show, store, update, modify, destroy }