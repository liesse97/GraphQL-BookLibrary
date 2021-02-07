const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//will pass an object with different tyoe that we will expect on our book 
const bookSchema = new Schema({
    name: String,
    genre: String,
    authorId: String
});

module.exports = mongoose.model('Book', bookSchema);
//will use this model to interact with our book model