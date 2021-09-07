const jwt = require("jsonwebtoken");

// Mise en place des variables d'environnement
const dotenv = require("dotenv");
dotenv.config();
const MY_APP_SECRET = process.env.APP_SECRET_KEY;
const URL_Site = process.env.URL_Site;

module.exports = (req, res, next) => {
  try {
    //récupération du token présent dans le header, découpage du token qui commence par bearer et on ne prend que la seconde partie qui correspond vraiment au token
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, MY_APP_SECRET);
    const userIdDecode = decodedToken.userId;

    // on vérifie : si on a un userId dans la requete et qu'il est différent du userId décodé présent dans le Token
    if (req.body.userId && req.body.userId != userIdDecode) {
      throw "User ID non valable";
    } else {
      next();
    }
  } catch (error) {
    console.log(res.status(401).json({ error: error })); // affiche l erreur dans la console
    res.status(401).redirect(URL_Site); // redirection à la racine du site sur la page de login
  }
};
