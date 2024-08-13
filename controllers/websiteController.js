//Afficher la page d'acceuil
exports.getHomepage = (req,res) =>{
    res.render('index',{
        title: 'HOMEPAGE',
        success: req.flash('success'),
        error: req.flash('error'),
        topFive: req.topFive,
        mostlike: req.mostlike     
    })
}

//Afficher la page de connexion
exports.getLoginPage = (req,res) =>{
    res.render('login',{
        title: 'LOGIN ',
        field: req.flash('field'),
        error: req.flash('error'),
    })
}

//Afficher la page d'inscription
exports.getSinginPage = (req,res) =>{
    res.render('signin',{
        title: 'SIGN IN',
        field: req.flash('field'),
        error : req.flash('error')
        
    })
}

//Afficher la page de l'utilisateur qui est connecté
exports.getMyPostPage = (req,res) =>{
    
    res.render('mypost',{
        title: 'MES PHOTOS',
        Userphoto: req.userPhoto,
        success: req.flash('success'),
        error: req.flash('error'),
    })
}

//Aficher la page de toutes les photos
exports.getAllPhotoPage= (req,res) =>{
    res.render('allphoto',{
        title: 'PHOTOS',
        Allphoto: req.allPhoto,
        current : req.current,
        pages: req.pages,
        success: req.flash('success'),
        error: req.flash('error'),
    })
}

//Afficher la page des commentaires
exports.getCommentPage= (req,res) =>{
    res.render(`comment`,{
        title:'COMMENTAIRES',
        onePhoto: req.onePhoto,
        allCom: req.allCom,
        success: req.flash('success'),
        error: req.flash('error'),
    })
}

 