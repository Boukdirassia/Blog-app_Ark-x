// ce middleware permet d'enregistrer toute les requetes envoyees au serveur 
//facilite debug ,analyse ,historique
function requestLogger(req, res, next) {
    try {
        const date = new Date();
        console.log(`Dans ${date} : Cette requête contient la méthode ${req.method} et l'URL ${req.url}`);
        next();
    } catch (error) {
        console.error({ message: error.message });
    }
}

module.exports = requestLogger;
