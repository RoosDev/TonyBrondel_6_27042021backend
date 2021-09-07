const passSchema = require("../models/Pass_models");

module.exports = (req, res, next) => {
  if (!passSchema.validate(req.body.password)) {
    res
      .status(400)
      .json({
        message:
          "Le mot de passe doit contenir minuscules et majuscules,  au moins 2 chiffres et 1 caractère spéciale. Taille minimum 8 caractères.",
      });
  } else {
    next();
  }
};
