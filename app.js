// import des extensions necessaires
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

// Définition des routes
const sauceRoutes = require("./routes/sauce_routes.js");
const userRoutes = require("./routes/user_routes");

//paramétrage de la connexion à la DB MongoDB
mongoose
  .connect(
    "mongodb+srv://sauceAdmin:ARpUjdjoPhJC4O4V@piiquantecluster.uqfpo.mongodb.net/sauceCollection?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.use(express.json());

// // Ajout d'une redirection en cas d'erreur 404 vers la page principale
//  app.use((req, res) =>{
// res.redirect(404, 'http://127.0.0.1:8081/');
// res.status(404).redirect('http://127.0.0.1:8081/');
// })

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
