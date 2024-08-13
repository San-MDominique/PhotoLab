const path = require('path');
const express = require ('express')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const session = require('express-session')

const userRoute = require('./routes/userRoutes')
const WebsiteRoute = require('./routes/websiteRoute')

dotenv.config({ path: './.env' })


const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(session({
    secret : process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie:{maxAge: 6000}
}))
app.use(flash())

//Serving static fille
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine','ejs')
app.set('views', path.join(__dirname,'views'))

// Api routes
app.use('/', userRoute)

// Website routes
app.use('/', WebsiteRoute)

// //404 handler
// app.get('*',(req,res)=>{
//     res.status(404).send('PAGE NOT FOUND')
// })

module.exports = app