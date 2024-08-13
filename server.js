const app = require('./app')
const mongoose = require('mongoose')

const port = process.env.PORT 
const db = process.env.DATABASE

mongoose.connect(db).then(()=>{
    console.log('connexion to database is successfull')
}).catch(err=>{
    console.log('connexion to Database is failed!!', err.message)
})

app.listen(port,()=>{
    console.log(`server Running on port ${port}`)
})
