const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
   bookName: String,
   authorName: String,
   category: {
    type:String,
    enum: [ "Comedy", "Thriller", "Horror", "Romance", "Science fiction" , "Adventure" ]
   },
   year: Number
}, {timestamps: true});

module.exports = mongoose.model('Book', bookSchema);