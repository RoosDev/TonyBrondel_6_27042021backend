// Intégration des modules nécessaires
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

// Mise en place des variables d'environnement
const dotenv = require("dotenv");
dotenv.config();
const MY_APP_SECRET = process.env.APP_SECRET_KEY;
const A2_ASSO_DATA = process.env.ARGON2_ASSOCIATEDDATA;

const Utilisateur = require("../models/User_models");

// hash du password avec argon2 : https://github.com/ranisalt/node-argon2/wiki/Options
exports.signup = (req, res, next) => {
  argon2
    .hash(req.body.password, {
      type: argon2.argon2id,
      timeCost: 12,
      hashLength: 128,
      associatedData: Buffer.from(A2_ASSO_DATA),
    })
    .then((hash) => {
      const utilisateur = new Utilisateur({
        email: req.body.email,
        password: hash,
      });
      utilisateur
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  Utilisateur.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur inconnu ." });
      }
      argon2
        .verify(user.password, req.body.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, MY_APP_SECRET, {
              expiresIn: "2h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
