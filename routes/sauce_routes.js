const express = require("express");
const router = express.Router();

const sauceCtrl = require("../controllers/sauce_control");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer_config");

// Ajout d'une sauce dans la mongoDB
router.post("", auth, multer, sauceCtrl.createSauce);

// pour la modification d'une sauce
router.put("/:id", auth, multer, sauceCtrl.modifySauce);

// pour la suppression d'une sauce
router.delete("/:id", auth, sauceCtrl.deleteSauce);

// Affiche une seule sauce
router.get("/:id", auth, sauceCtrl.getOneSauce);

// Affiche toutes les sauces
router.get("", auth, sauceCtrl.getAllSauces);

// Ajoute un Like ou dislike
router.post("/:id/like", auth, sauceCtrl.addAVote);

module.exports = router;
