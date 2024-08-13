const mongoose = require('mongoose')
const validator = require('validator')

const photoSchema = new mongoose.Schema({
    photo:{
        type: String,
        required: true,
    },
    created_At: {
        type: Date,
        default: Date.now()
    },
    postedBy:{
        type: mongoose.Schema.ObjectId, 
        ref: 'User'
    },
    likes:[{
        type: String,
    }],

    comment:[{
        type: String,
    }]
})

const Photo = mongoose.model('Photo', photoSchema)

module.exports = Photo