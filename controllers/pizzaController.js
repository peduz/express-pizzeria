const menu = require('../data/menu');

function index(req, res) {
    let filteredMenu = menu;
    const ingredient = req.query.ingredient;
    if (ingredient) {
        filteredMenu = menu.filter(pizza => {
            return pizza.ingredients.includes(ingredient);
        })
    }

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
    res.send('Creazione nuova pizza');
}

function update(req, res) {
    res.send('Modifica integrale della pizza ' + req.params.id);
}

function modify(req, res) {
    res.send('Modifica parziale della pizza ' + req.params.id);
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