const Sauce = require("../models/Sauce_models");

const fs = require("fs");
const path = require("path");
const { start } = require("repl");

// Mise en place des variables d'environnement
const dotenv = require("dotenv");
dotenv.config();
const URL_Site = process.env.URL_Site;

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() =>
      res.status(201).json({ message: "Sauce enregistrée ! Miam !!" })
    )
    .catch((error) => res.status(400).json({ error }));
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
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Réponse modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1]; // on découpe l'URL avec comme séparateur /images/ comme ça , ça renvoi 1 tableau avec 2 éléments (1: l url avant /images/ et 2: le nom du fichier). Donc on sélectionne le 2eme élément du tableau
      fs.unlink(`images/${filename}`, () => {
        // fs.unlink fonction de suppression du fichier  avec fs
        Sauce.deleteOne({ _id: req.params.id }) // une fois le fichier supprimé on supprime l'objet dans la base
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch(
      (error) =>
        res.status(404).json({ error }) && res.status(404).redirect(URL_Site)
    );
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch(
      (error) =>
        res.status(400).json({ error }) && res.status(400).redirect(URL_Site)
    );
};

exports.addAVote = (req, res, next) => {
  const like = req.body.like;
  const userId = req.body.userId;
  const bookId = req.params.id;
  
  Book
    .findOne({ bookId})
    .then(
      [{
        $switch:{
          branches: [
            { case: { $eq: [ like , 1 ] },
              then: { $inc: { likes: +1 }, $push: { usersLiked: userId } }},

            { case: { $eq: ["$like" , -1] },
              then: { $inc: { dislikes: +1 }, $push: { usersDisliked: userId } }},

            { case: { $and: [ { $eq: [ "$like" , 0 ] },
                              { $in: [ userId , "usersLiked" ] }]},
              then: { $and: [ { $inc: { likes: -1 },
                                $pull: { usersLiked: userId }}]}},

            { case: { $and: [ {$eq: [ "$like" , 0 ]},
                              { $in: [ userId , "usersDisliked" ] }]},
              then: { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId }}},
          ],
        }
      }]
    )
    .then(() =>
    res.status(200).json({
      message: "Vote enregistrée,   :( ",
    })
  )
    .catch(
      (error) =>
        res.status(400).json({ error }) && console.log("big problem")
    );


  // switch (like) {
  //   case 1:
  //     Sauce.updateOne(
  //       { _id: req.params.id },
  //       { $inc: { likes: +1 }, $push: { usersLiked: userId } }
  //     )
  //       .then(() =>
  //         res
  //           .status(200)
  //           .json({ message: "Vote enregistrée,  merci pour ce like :D " })
  //       )
  //       .catch(
  //         (error) =>
  //           res.status(400).json({ error }) && console.log("big problem")
  //       );
  //     break;
  //   case 0:
  //     Sauce.findOneAndUpdate([
  //       {
  //         $sauceId: {
  //           $switch: {
  //             branches: [
  //               {
  //                 case: { $in: [userId, "$usersLiked"] },
  //                 then: { $inc: { likes: -1 }, $pull: { usersLiked: userId } },
  //               },

  //               {
  //                 case: { $in: [userId, "$usersDisliked"] },
  //                 then: {
  //                   $inc: { dislikes: -1 },
  //                   $pull: { usersDisliked: userId },
  //                 },
  //               },
  //             ],
  //           },
  //         },
  //       },
  //     ])

  //       // // une version bancale niveau fonctionnement
  //       //       .updateOne(
  //       //           { _id: req.params.id, usersLiked: {$in: [userId] } },
  //       //           { $inc: { likes: -1},
  //       //             $pull: {usersLiked: userId}},
  //       //         )
  //       //         .updateOne(
  //       //           { _id: req.params.id, usersDisliked: {$in: [userId]} },
  //       //           { $inc: { dislikes: -1},
  //       //             $pull: {usersDisliked: userId}},
  //       //         )
  //       .then(() =>
  //         res
  //           .status(200)
  //           .json({ message: "Vous avez changé d'avis, c'est noté :( " })
  //       )
  //       .catch((error) => res.status(400).json({ error }));

  //     break;
  //   case -1:
  //     Sauce.updateOne(
  //       { _id: req.params.id },
  //       { $inc: { dislikes: +1 }, $push: { usersDisliked: userId } }
  //     )
  //       .then(() =>
  //         res.status(200).json({
  //           message: "Vote enregistrée, désolé que vous n'aimiez pas  :( ",
  //         })
  //       )
  //       .catch(
  //         (error) =>
  //           res.status(400).json({ error }) && console.log("big problem")
  //       );
  //     break;
  //   default:
  //     console.log(err);
  // }
};
