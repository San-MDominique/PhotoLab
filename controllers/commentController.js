const Comment = require('../model/commentModel')
const Photo = require('../model/photoModel')


//créer un nouveau commentaire
exports.createComment =  async (req,res,next)=>{
    try {
        const newComment = await Comment.create({
            postedBy: req.user.username,
            photo: req.body.id,
            comment: req.body.comment,
            profil: req.user.photo
        })
        const Addcom =  await Photo.findByIdAndUpdate({_id:req.body.id},{$push:{comment:newComment.id}})
        if(newComment){
            req.flash('success','Votre commentaire a été ajouté avec succès!!!')
            res.redirect(`/photo/${req.body.id}`)
        }
    } catch (error) {
        console.log(error.message)
    }
}


//Afficher tous les commentaires
exports.getComment = async(req,res,next)=>{
    try {
        const allCom = await Comment.find({photo: req.params.id}).populate('postedBy')
        if(allCom){req.allCom = allCom} else {allCom = 'none'}
    } catch (err) {
        console.log(err.message)
    }
    next()
}

//Supprimer un commentaire
exports.delCom = async(req,res,next)=>{
    try {
        await Photo.findByIdAndUpdate({_id:req.params.photo},{$pull:{comment:req.params.id}})
        await Comment.findByIdAndDelete({_id: req.params.id})
        
        req.flash('success','Votre commentaire a été supprimer!!')
        res.redirect(`/photo/${req.params.photo}`)

    } catch (err) {
        console.log(err.message)
    }
}

