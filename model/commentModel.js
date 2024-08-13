const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    postedBy: {
        type: String
    },
    postedAt:{
        type: Date,
        default: Date.now()
    },
    photo:{
        type: mongoose.Schema.ObjectId,
        ref:'Photo',
        require: true
    },
    comment:{
        type: String,
    },
    profil:{
        type: String
    }

})

const Comment = mongoose.model('Comment',commentSchema)

module.exports = Comment