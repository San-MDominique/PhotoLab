const mongoose =  require('mongoose')
const validator = require('validator')

const UserSchema  = new mongoose.Schema({
    username : {
        type: String,
        require:[true,`L'utilissateur doit avoir un nom`]
    },
    email: {
        type: String,
        unique: true,
        lowercase : true,
        validate : [validator.isEmail,`L'utilisateur doit avoir une address email valide!!`],
        require: [true,`L'utilisateur doit avoir un email`]

    },
    password:{
        type: String,
        require: [true,`L'utilisateur doit avoir un mot de passe`],
        minlength:[8,'Le mot de passe doit contenir au moins 8 caractères'],
        select: false

    },
    photo:{
        type: String,
    }
})

const User = mongoose.model('User',UserSchema)

module.exports = User