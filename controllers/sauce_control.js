const Sauce = require("../models/Sauce_models");

const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
//createSauce est le nom qu'on lui donne pour savoir que c est pour la creation d un objet

exports.createSauce = (req, res, next) => {

  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
      }`,
    usersLiked : JSON.stringify([]),
    usersDisliked : JSON.stringify([]),
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée ! Miam !!" }))
    .catch(
        (error) => res.status(400).json({ error }))
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file // utilisation d'un opérateur ternaire pour voir si l'objet existe ou non
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce
    .updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    )
    .then(() => res.status(200).json({ message: "Réponse modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce
    .findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1]; // on découpe l'URL avec comme séparateur /images/ comme ça , ça renvoi 1 tableau avec 2 éléments (1: l url avant /images/ et 2: le nom du fichier). Donc on sélectionne le 2eme élément du tableau
      fs.unlink(`images/${filename}`, () => { // fs.unlink fonction de suppression du fichier  avec fs 
        Sauce.deleteOne({ _id: req.params.id })   // une fois le fichier supprimé on supprime l'objet dans la base 
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }) && 
    res.redirect(404, path));
};

exports.getAllSauces = (req, res, next) => {
  Sauce
    .find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }) && 
    res.redirect(404, path));
};

exports.createAVote = (req, res, next) => {
  console.log('mon array liked : ' + sauces_books.usersLiked)

  // let likers = JSON.parse(req.body.usersLiked);
  // let dislikers = JSON.parse(req.body.usersDisliked);
  

  function likerOrdDisliker(score){
    switch (score){
      case 1 : 
        likers.push({
          userId: req.body.userId
        });
        let usersLiked = JSON.stringify(likers);
        break;
        case -1 : 
        dislikers.push({
          userId: req.body.userId
        });
        let usersDisliked = JSON.stringify(dislikers);
        break;

    }
  }
  likerOrdDisliker(req.body.like);

  Sauce
    .updateOne(
      { _id: req.params.id },
      { likes: req.body.like }, 
      { usersLiked: usersLiked },
      { dislikes: req.body.dislike }, 
      { usersDisliked: usersDisliked }
    )
    .then(() => res.status(201).json({ message: "Vote enregistrée :)" }))
    .catch((error) => res.status(400).json({ error }) && console.log('big problem'));

};

