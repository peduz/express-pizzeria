const express = require('express')

const app = express()

const port = 3000;

const pizzasRouter = require('./routers/pizzas')

const menu = require('./data/menu')

app.use(express.static('public'))


app.get('/health', (req, res) => {
    res.json({ status: "Applicazione in funzione." })
})

app.use('/pizzas', pizzasRouter)

app.listen(port, () => {
    console.log("Applicazione partita.")
})