const express = require('express');
//require('express-graphql') returns an object with a property called graphqlHTTP that is the function you want to call.
//You're trying to call the object itself as if it was a function.

const app = express();

﻿
//allow cross-origin request from front end
//we install cors to allow requestes from other package like front-end 
const cors = require('cors');
app.use(cors());


const graphqlHTTP = require('express-graphql').graphqlHTTP;
// or const {graphqlHTTP} = require('express-graphql');  not const graphqlHTTP = require('express-graphql') becuse this is an object;

//importing the schema
const schema = require('./schema/schema');
const mongoose = require('mongoose');

// const uri="mongodb+srv://liesse:12345@cluster0.3o3fz.mongodb.net/<dbname>?retryWrites=true&w=majority";
const uri= "mongodb+srv://liesse:12345@cluster0.3o3fz.mongodb.net/<dbname>?retryWrites=true&w=majority"

//connect the mongodb database
mongoose.connect(uri,{
      useUnifiedTopology: true ,
       useNewUrlParser: true
})
//an event listen to a function once it open
mongoose.connection.once('open', () => {
    console.log('conneted to database');
});


// bind express with graphql
//1. middleware, 2.route 3.handle the graphql
app.use('/graphql',graphqlHTTP({
    //have the schema in the middleware to map the graph
   //it is defining our graphql, the data that is going to be define in mongodb so that monogb will understad tje data
    schema,

   //we want to use the graphiql tools when we go to the(/graphql) in our browser
   graphiql: true
}));

app.listen(5000, () => {
    console.log('now listening for requests on port 5000');
});