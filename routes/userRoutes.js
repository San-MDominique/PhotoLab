const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

//Route pour la creation des utilisateurs
router.route('/signup').post( userController.createUser)

//Route pour la connexion des utilisateur
router.route('/login').post(userController.loginUser)

//Route pour le deconnexion d'un utilistateur
router.route('/logout').get(userController.logout)

module.exports= router
