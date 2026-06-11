const menu = require('../data/menu');

const connection = require('../data/db')

function index(req, res) {

    const status = req.query.status;
    const ingredient = req.query.ingredient;

    const sql = 'SELECT * FROM pizzas';

    connection.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }

        console.log(results)

        res.json(results);
    });

    /**
     * 
     * Commento per non cancellare
    if (status == "premium") {
        let filteredMenu = menu;
        if (ingredient) {
            filteredMenu = menu.filter(pizza => {
                return pizza.ingredients.includes(ingredient);
            })
        }
        res.json(filteredMenu);
    } else {
        let pizzas = menu.filter(pizza => {
            return pizza.id !== 100;
        })

        if (ingredient) {
            pizzas = pizzas.filter(pizza => {
                return pizza.ingredients.includes(ingredient);
            })
        }
        res.json(pizzas);
    }

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
}

function show(req, res) {
    const { id } = req.params;

    const sql = 'SELECT * FROM pizzas WHERE id = ?';


    const ingredientSQL = `
            SELECT I.* 
            FROM ingredients as I
            JOIN ingredient_pizza as IP on I.id = IP.ingredient_id
            WHERE IP.pizza_id = ?
            `

    connection.query(sql, [id], (err, results) => {

        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (!results) {
            res.status(404)
            res.json({
                error: "Not found",
                message: "Pizza non trovata"
            })
        }

        connection.query(ingredientSQL, [id], (err, ingredientResults) => {
            if (err) {
                return res.status(500).json({ error: 'Database query failed' });
            }

            const pizzaWithIngredients = {
                ...results[0],
                ingredients: ingredientResults,
            }
            res.json(pizzaWithIngredients);
        })

    });

}

function store(req, res) {
    //recuperiamo i dati dal corpo della richiesta
    const { name, image, ingredients } = req.body;
    // prepariamo la query
    const sql = 'INSERT INTO pizzas (name, image) VALUES (?, ?)'

    const ingredientsSql = "INSERT INTO ingredient_pizza (ingredient_id, pizza_id) VALUES (?, ?)"

    // eseguiamo la query
    connection.query(
        sql,
        [name, image],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Failed to insert pizza' });
            res.status(201); // status corretto
            console.log(results)
            const pizzaId = results.insertId;
            if (!ingredients || ingredients.length === 0) {
                res.json({ response: "Inserimento completato" })
            }
            let count = 0;
            let errorOccurred = false;
            ingredients.forEach(ingredientId => {

                connection.query(ingredientsSql, [ingredientId, pizzaId], (err, results) => {
                    if (errorOccurred) return;

                    if (err) {
                        errorOccurred = true;
                        return res.status(500).json({ error: "Failed to insert ingredients" })
                    }
                    count++;

                    if (count === ingredients.length) {
                        res.status(201).json({ response: "Inserimento Completato" })
                    }
                })
            });
        }
    );
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
    *

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
    */
    // recuperiamo l'id dall' URL
    const { id } = req.params;

    // recuperiamo i dati dal body della richiesta
    const { name, image } = req.body;

    // Prepariamo la query per aggiornare la pizza
    connection.query(
        'UPDATE pizzas SET name = ?, image = ? WHERE id = ?',
        [name, image, id],
        (err) => {
            if (err) return res.status(500).json({ error: 'Failed to update pizza' });
            res.json({ message: 'Pizza updated successfully' });
        }
    );
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

    // recuperiamo l'id dall' URL 
    const { id } = req.params;

    //Eliminiamo la pizza dal menu                       
    connection.query('DELETE FROM pizzas WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to delete pizza' });
        res.sendStatus(204)
    });
}

// esportiamo tutto
module.exports = { index, show, store, update, modify, destroy }