function checkTime(req, res, next) {
    // se l'ora è dopo le 22:00 e prima delle 7:00 
    // rispondiamo con un messaggio di errore
    const currHour = new Date().getHours();

    console.log("Passato dal middleware alle ore", currHour)
    if (currHour >= 22 || currHour < 7) {
        res.status(400)
        return res.send("Meglio se vai a dormire!");
    }

    next();
}

module.exports = checkTime