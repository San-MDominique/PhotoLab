const Photo = require('../model/photoModel')
const Comment = require('../model/commentModel')
const multer = require('multer')
const path = require('path')
const fs = require('fs')


//************************************************** */
//configuration de Multer(Qui permet de uploader les images)
const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null, 'public/img/photo')
    },
    filename:(req,file,cb)=>{
        const ext = file.mimetype.split('/')[1]
        cb(null, `photo-${req.user.id}-${Date.now()}.${ext}`)
    }
})

const multerFilter = (req, file, cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }else{
        cb(req.flash('vous ne pouvez uploader que des images'), false)
    }
}
const uploade = multer({storage, multerFilter})

//************************************************** */

exports.uploadPhoto =  uploade.single('photo')

//Uploader une photo
exports.addPhoto = async(req,res,next)=>{
    //curent Page
        
    try {
        const newPhoto = await Photo.create({
            photo: req.file.filename,
            postedBy: req.user.id,
        })
        req.flash('success',"Vous Venez d'ajouter une photo")
        res.redirect('/mypost'); 

    } catch (err) {
        req.flash('error',`Erreur Interne reesayez plus tard!`)
        res.redirect('/');
    }
}

//Afficher les photo poster par un utilisateur en partitulier
exports.getAllUSerPhoto = async(req,res,next) =>{
    try {
        const userPhoto = await Photo.find({postedBy:req.user.id})
        if(userPhoto){req.userPhoto = userPhoto} else {
            req.userPhoto = 'none'
        }
        
    } catch (err) {
        req.flash('error',`Erreur interne, veuillez réessayer ultérieurement.`)
        res.redirect('/mypost');
    }
    next()
}

//Supprimer un photo
exports.deletePhoto = async(req,res,next) =>{
        try {
            const photodel = await Photo.findOne ({photo: req.params.photo })
            for (let i = 0; i < photodel.comment.length; i++) {
               const delCom = await Comment.findByIdAndDelete({_id:photodel.comment[i]})          
            } 
            await Photo.findByIdAndDelete({_id:photodel._id})
            fs.unlinkSync(`${__dirname}/../public/img/photo/${photodel.photo}`)
            req.flash('error',`Photo supprimer avec success!!`)
            res.redirect('/mypost')
        } catch (err) {
            req.flash('error',`Erreur interne, veuillez réessayer ultérieurement!`)
            console.log(err.message)
            res.redirect('/mypost');
        }
   
}

//Liker ou Unliker une photo au niveux de la page MyPost
exports.likePhoto = async(req,res,next)=>{
    try {
        const likeReq =  await Photo.findOne({_id:req.params.id})
        const likesArray  = likeReq.likes

        if(likesArray.includes(req.user.id) == false){
            await Photo.findByIdAndUpdate({_id:req.params.id},{$push:{likes:req.user.id}})
            req.flash('success',`Vous venez de liker une de vos photos !`)
            res.redirect('/mypost')
        }else
        {   
            await Photo.findByIdAndUpdate({_id:req.params.id},{$pull:{likes:req.user.id}})
            req.flash('error',`Vous n'amez plus l'une de vos photos !`)
            res.redirect('/mypost')
        }

    } catch (err) {
            req.flash('error',`Erreur interne, veuillez réessayer ultérieurement!`)
            res.redirect('/mypost');
    }
}

//Afficher toute les photos de tous les utilisateurs
exports.getAllPhoto = async(req,res,next) =>{
    const perPage = 6
    const page = req.query.p || 0
    try {

        const allPhoto = await Photo.find()
                                     .sort({created_At: -1})
                                     .limit(perPage)
                                     .skip(page * perPage)
                                     .populate('postedBy')
        if(allPhoto){
            req.allPhoto = allPhoto
            req.pages = perPage,
            req.curent = page

        } else {
            req.allPhoto = 'none'
        }
        
    } catch (err) {
        
    }

    next()
}

//Afficher les 5 photo les plus récente
exports.getTopFive = async(req,res,next) =>{
    try {
        const topFive = await Photo.find().sort({created_At: -1}).limit(4).populate('postedBy')
        if(topFive){req.topFive= topFive} else {
            req.topFive = 'none'
        }
        
    } catch (err) {
       
    }
    next()
}

//Aficher les photo les plus Aimer
exports.getMostlike = async(req,res,next) =>{
    try {
        const mostlike = await Photo.find().where({likes: {$gte : 1}}).sort({likes: -1}).limit(4).populate('postedBy')

        if(mostlike){req.mostlike = mostlike} else {
            req.mostlike = 'none'
        }
        
    } catch (err) {
        
    }
    next()
}

//Liker ou Unliker une photo au niveux de la page Toutes les photos
exports.likePhotoAllphoto = async(req,res,next)=>{
    try {
        const likeReq =  await Photo.findOne({_id:req.params.id})
        const likesArray  = likeReq.likes

        if(likesArray.includes(req.user.id) == false){
            await Photo.findByIdAndUpdate({_id:req.params.id},{$push:{likes:req.user.id}})

            req.flash('success',`Vous avez liker une photo `)
            res.redirect('/allphoto')
        }else
        {   
            await Photo.findByIdAndUpdate({_id:req.params.id},{$pull:{likes:req.user.id}})

            req.flash('error',`Vous n'aimez plus une photo`)
            res.redirect('/allphoto')
        }

    } catch (err) {
        req.flash('error',`Erreur interne, veuillez réessayer ultérieurement!`)
        res.redirect('/allphoto')
    }
}

//Liker ou Unliker une photo au niveux de la page d'accueil
exports.likePhotoIndexPage = async(req,res,next)=>{
    try {
        const likeReq =  await Photo.findOne({_id:req.params.id})
        const likesArray  = likeReq.likes

        if(likesArray.includes(req.user.id) == false){
            await Photo.findByIdAndUpdate({_id:req.params.id},{$push:{likes:req.user.id}})
            req.flash('success',`Vous avez liker une photo `)
            res.redirect('/')
        }else
        {   
            await Photo.findByIdAndUpdate({_id:req.params.id},{$pull:{likes:req.user.id}})
            req.flash('error',`Vous n'aimez plus une photo`)
            res.redirect('/')
        }

    } catch (err) {
        req.flash('error',`Erreur interne, veuillez réessayer ultérieurement!`)
        res.redirect('/')
    }
}

//Liker ou Unliker une photo au niveux de la page commentaire
exports.likePhotocomment = async(req,res,next)=>{
    try {
        const likeReq =  await Photo.findOne({_id:req.params.id})
        const likesArray  = likeReq.likes

        if(likesArray.includes(req.user.id) == false){
            await Photo.findByIdAndUpdate({_id:req.params.id},{$push:{likes:req.user.id}})
            req.flash('success',`Vous avez liker une photo `)
            res.redirect(`/photo/${req.params.id}`)
        }else
        {   
            await Photo.findByIdAndUpdate({_id:req.params.id},{$pull:{likes:req.user.id}})
            req.flash('error',`Vous n'aimez plus une photo`)
            res.redirect(`/photo/${req.params.id}`)
        }

    } catch (err) {
        req.flash('error',`Erreur interne, veuillez réessayer ultérieurement!`)
        res.redirect('/')
    }
}

//Afficher une photo en particulier
exports.getOnePhoto = async(req,res,next)=>{
    try {
        const onePhoto = await Photo.findById({_id:req.params.id}).populate('postedBy')
        if(onePhoto){req.onePhoto = onePhoto}else{ req.onePhoto  = 'none'}
    } catch (err) {
        console.log(err.message)
    }
    next()
}
