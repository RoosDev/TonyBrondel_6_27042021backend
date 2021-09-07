const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user_control");
const passValidation = require("../middleware/pass_Validation");

router.post("/signup", passValidation, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
