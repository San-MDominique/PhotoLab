const express = require('express')
const router = express.Router()

const websiteContoller = require('../controllers/websiteController')
const userController = require('../controllers/userController')
const photoController = require('../controllers/photoController')
const commentController = require('../controllers/commentController')

//Route vers la page d'acceuil
router.route('/')
                .get( userController.isLoggedIn,photoController.getMostlike, photoController.getTopFive,websiteContoller.getHomepage)
//Route pour liker une photo depuis la page d'acceuil
router.route('/likeindex/:id')
                .get(userController.protect, photoController.likePhotoIndexPage)

//route vers la page de connexion
router.route('/login')
                .get(websiteContoller.getLoginPage)
                .post(userController.loginUser)

//route vers la page de connexion
router.route('/singin')
                .get(websiteContoller.getSinginPage)
                .post(userController.createUser)

//Route vers la page de l'utilisateur connecté
router.route('/mypost')
                .get(userController.protect,photoController.getAllUSerPhoto, websiteContoller.getMyPostPage)
                .post(userController.protect, photoController.uploadPhoto, photoController.addPhoto)

//Route pour la suppression d'une photo
router.route('/delete/:photo')
                .get(userController.protect, photoController.deletePhoto)

//Route pour liker une photo depuis la allPhoto 
router.route('/like/:id')
                .get(userController.protect, photoController.likePhoto)

//route pour avour Toute les photos
router.route('/allphoto')
                .get(userController.isLoggedIn, photoController.getAllPhoto , websiteContoller.getAllPhotoPage)
                
router.route('/likeallphoto/:id')
                .get(userController.protect, photoController.likePhotoAllphoto)

router.route('/photo/:id')
                .get(userController.protect,photoController.getOnePhoto,commentController.getComment, websiteContoller.getCommentPage)
                .post(userController.protect, commentController.createComment)

router.route('/likeCom/:id').get(userController.protect, photoController.likePhotocomment)                

router.route('/postCom')
                .post(userController.protect, commentController.createComment)

router.route('/delcom/:id/:photo')
                .get(userController.protect, commentController.delCom,)

router.route('/mypostProf')
                .post(userController.protect, userController.uploadPhoto, userController.updatePhoto)

module.exports = router
