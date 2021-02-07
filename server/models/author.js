const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//will pass an object with different tyoe that we will expect on our book 
const authorSchema = new Schema({
    name: String,
    age: Number
});

module.exports = mongoose.model('Author', authorSchema);
//will use this model to interact with our book model