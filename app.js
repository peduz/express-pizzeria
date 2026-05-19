const express = require('express')

const checkTime = require('./middlewares/checkTime')

const app = express()
// registro il body-parser per "application/json"
app.use(express.json());

const port = 3000;

const pizzasRouter = require('./routers/pizzas')

const menu = require('./data/menu')

app.use(express.static('public'))


app.get('/health', (req, res) => {
    res.json({ status: "Applicazione in funzione." })
})

app.get('/v2/health', checkTime, (req, res) => {
    res.json({ status: "Applicazione in funzione." })
})

app.use('/pizzas', pizzasRouter)


const errorsHandler = require("./middlewares/errorsHandler");
app.use(errorsHandler);
const notFound = require("./middlewares/notFound");
app.use(notFound)

app.listen(port, () => {
    console.log("Applicazione partita.")
})