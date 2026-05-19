const express = require("express");
const router = express.Router();

const menu = require('../data/menu')

const checkTime = require('../middlewares/checkTime')
const statusController = require('../middlewares/statusController')

const pizzaController = require('../controllers/pizzaController')

router.use(checkTime)

// index
router.get('/', pizzaController.index);

// show
router.get('/:id', statusController, pizzaController.show);

// store
router.post('/', pizzaController.store);

// update
router.put('/:id', pizzaController.update);

// modify
router.patch('/:id', pizzaController.modify);

// destroy
router.delete('/:id', pizzaController.destroy);

module.exports = router