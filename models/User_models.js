const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); 

const userSchema = mongoose.Schema({
    email : {type: String, required: true, unique: true, match:/^([a-zA-Z0-9_-])+([.]?[a-zA-Z0-9_-]{1,})*@([a-zA-Z0-9-_]{2,}[.])+[a-zA-Z]{2,}\\s*$/},
    password: {type: String, required: true}
})
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Utilisateur', userSchema);