// import des extensions necessaires
const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const path = require("path");

// Définition des routes
const sauceRoutes = require("./routes/sauce_routes.js");
const userRoutes = require("./routes/user_routes");

// Mise en place des variables d'environnement
const dotenv = require("dotenv");
dotenv.config();
// const URL_Site = process.env.URL_Site;
const URL_MonDb = process.env.URL_DB;

//paramétrage de la connexion à la DB MongoDB
mongoose
  .connect(URL_MonDb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();
app.use(helmet());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// body parser est directement intégré à express maintenant
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

// Gestionnaire d'erreurs sous express
// app.use(function(err, req, res, next) {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
//   res.status(404).redirect(URL_Site);
// });

module.exports = app;
