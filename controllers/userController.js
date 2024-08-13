const User = require('../model/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { promisify } = require('util'); // this pakacge is on nodeJs by default your don't need to install it
const createSendToken = require('../middleware/sendJwtToken')
const multer = require('multer')

//************************************************** */
//Multer Config
const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null, 'public/img/user')
    },
    filename:(req,file,cb)=>{
        const ext = file.mimetype.split('/')[1]
        cb(null, `photo-${req.user.id}.${ext}`)
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

//CREE UN UTILISATEUR

//Uploader une photo de profil
exports.updatePhoto = async(req,res,next)=>{
    //curent Page
        
    try {
        const photouserDel = await User.findById({_id:req.user.id})
        const newPhoto = await User.findByIdAndUpdate({ _id: photouserDel.id},{photo: req.file.filename})
        req.flash('success',"Vous Venez de modifier votre photo de profil")
        res.redirect('/mypost'); 

    } catch (err) {
        req.flash('error',`Erreur Interne reesayez plus tard!`)
        console.log(err.message)
        res.redirect('/mypost');
    }

}
exports.uploadPhoto =  uploade.single('photo')


//Creer un nouvel utilisateur
exports.createUser = async(req,res,next)=>{
    const fieldName = [req.body.username,req.body.email,req.body.password]

    try {
        const verifUser = await User.findOne({email: fieldName[1]})

        if(verifUser){
            req.flash('error','Cet email est deja utilisé par un autre utilisateur!!!')
            req.flash('field', fieldName)
            res.redirect('/singin'); 
        } else{

            const hashPassword  = await bcrypt.hash(fieldName[2], 10)

            const newUser = await User.create({
                username: fieldName[0],
                email: fieldName[1],
                password: hashPassword,
                photo: 'ImageUser'
            })
            req.flash('success','Bienvenue Votre compte a été créer avec success!!!')
            createSendToken(newUser ,res) 
            res.redirect('/');    
        }

    } catch (err) {
        req.flash('error',`${err.message}`)
        req.fieldName(fieldName)

        res.redirect('/singin'); 
    }
    next()
}

//Connexion d'un utilisateur
exports.loginUser = async(req,res,next)=>{
    try {
        const fieldName = [req.body.email.trim() ,req.body.password.trim()]

        if(!fieldName[0] || !fieldName[1]){
            req.flash('error','Veillez entrez un email et un mot de passe svp!!!')
            res.redirect('/login')
        } else{
            
            const user = await User.findOne({email:fieldName[0]}).select('+password')

            if(!user || !await bcrypt.compare(fieldName[1], user.password)){

                    req.flash('error',"l'email ou le mot de passe est incorrect")
                    req.flash('field', fieldName)
                    res.redirect('/login')
            } else{
                createSendToken(user,res) 
                req.flash('success',`Bienvenue ${user.username}`)
                res.redirect('/'); 
            }
            
        }
    } catch (err) {
        req.flash('error',`${err.message}`)
        res.redirect('/login');
    }
}

//Verifier si un utilisateur est connecté
exports.isLoggedIn = async (req, res, next)=> {
    
    if(req.cookies.MySuperCookie){

        try {
                    // 1- Verification token
                const decoded = await promisify(jwt.verify)(
                    req.cookies.MySuperCookie, 
                    process.env.JWT_SECRET
                );

                // 2- Check if user still exists
                const currentUser = await User.findById(decoded.id);
                if (!currentUser) { 
                    return next()
                }       
                    
                //GRANT ACCESS TO PROTECTD ROUTE
                res.locals.user = currentUser;
                return next()
                
        } catch (error) {
            res.locals.user = 'none';
            return next()
        }
    } else{
        res.locals.user = 'none';
    next()
    }
    
}


//Deconnecté un utilistateur
exports.logout = async(req,res)=>{
    res.cookie('MySuperCookie', 'loggedout',{
        expires: new Date( Date.now() + 1 * 1000 ),
        httpOnly: true
    });
    req.flash('error',"Utilisateur déconnecté avec succès")
    res.redirect('/')
}

//Proteger les route de notre apli avec la verification des token et cookie
exports.protect = async (req, res, next) => {
    try {
        // 1- Getting token and check of it's there
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
          token = req.headers.authorization.split(' ')[1];
        } else if(req.cookies.MySuperCookie){ token = req.cookies.MySuperCookie}
    
     if (!token) {
        return next(
            res.cookie('MySuperCookie', 'loggedout',{
            expires: new Date( Date.now() + 1 * 1000 ),
            httpOnly: true
        }),
        res.redirect('/login') )  
     }
    
     // 2- Verification token
     const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
     
     // 3- Check if user still exists
     const currentUser = await User.findById(decoded.id);
     if (!currentUser) {
        return next(
            res.cookie('MySuperCookie', 'loggedout',{
            expires: new Date( Date.now() + 1 * 1000 ),
            httpOnly: true
        }),
        res.redirect('/login') )
    }
    
    //  //GRANT ACCESS TO PROTECTD ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
     
       } catch (err) { }
    next()
}; 