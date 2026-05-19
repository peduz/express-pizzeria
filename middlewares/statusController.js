function statusController(req, res, next) {

    /**
     * Recuperiamo lo status
     * Recuperiamo anche l'id della pizza passata
     * 
     * Verifichiamo che lo status sia "premium" E che l'id della pizza sia il 100
     * - se l'id della pizza non è 100 -> next()
     * - altrimenti
     *      - se lo status è premium possiamo passare alla prossima richiesta
     *      - se non è premium ritoriamo un errore: 404 not found
     */

    const id = req.params.id;
    const status = req.query.status;
    if (status == "premium" || parseInt(id) !== 100) {
        next();
    } else {
        res.status(404)
        res.send("Pizza non trovata")
    }

}

module.exports = statusController;