const passwordValidator = require('password-validator');

// Création du schema
var passSchema = new passwordValidator();
 
// Ajout des propriétés du password
passSchema
.is().min(8)                                    // Minimum 8 caractères
.is().max(100)                                  // Maximum 100 caractères
.has().uppercase(1)                             // Doit avoir des majuscules
.has().lowercase(1)                             // Doit avoir des minuscules
.has().digits(2)                                // Doit comporter au moins 2 chiffres
.has().symbols(1)                               // Doit contenir un caractère spécial
.has().not().spaces()                           // Aucun espace
.is().not().oneOf(['Passw00rd', 'Password123', 'P@ssw00rd']); // Blacklist 
 
module.exports = passSchema;