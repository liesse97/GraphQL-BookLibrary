//mutation is what allow us to mutate or change our deata(adding and changing data),
//In graphql we have to explicatily explain what data is llowed to mutate

//where we are going our scheme that is going to describe the data, allstå the relation between them and how we can reach into the graphl to interact(query,mutate)


//we grab all the differen property from the graphql
// and we define our first our first object type which is a BookType which has different fields which are wrap a function

//require graphql

//when we have depedencies from one tpye to another then graphql may not recognize the dependecies because one is before the other

const graphql = require('graphql');
// "../ means go up folder"
const Book = require('../models/books');
const Author = require('../models/Author');

//calling lodash library
//we install loadash, allow us different way to find data inside this array, change it and more
const _ = require('lodash');



//define object type we want like(books), grab from graphql
//we are taking the variable type and storing it to qraphql so we can use it inside the file
const { GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

// function taht takes an object that are going to define what this booktype is all about
const BookGroup = new GraphQLObjectType({
    name: 'Book',
    //fields are going to be like a name property, a genre and id, important to have it like afunction so they can recognise each other
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        //author is parent
        author: {
            type: AuthorGroup,
            //use the resolve function to tell the graphql which auther correspend to the book
            //we have the data on the parent object that has pass throught to the resolve function
            resolve(parent, args) {
                //  console.log(parent)
                //parent is the initial author
                // return _.find(authors, { id: parent.authorId });

                //whenever user make a query for the books,then they can also request the author
                return Author.findById(parent.authorId);


            }
        }

    })
});

const AuthorGroup = new GraphQLObjectType({
    name: 'author',
    //fields are going to be like a name property, a genre and id, important to have it like afunction so they can recognise each other
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        //books is parent
        books: {
            //we want to list all books of an author not just one
            type: new GraphQLList(BookGroup),

            resolve(parent, args) {
                //  return all the books with the same auther Id
                console.log(parent.id)
                // return _.filter(books, { authorId: parent.id });

                return Book.find({ authorId: parent.id });

            }
        }

    })
});

const Mutate = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        //will allow us to add author,delet
        AddAuthor: {
            type: AuthorGroup,
            //two argument we expect from the user when they are using the mutation add author
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            //lwhere we take the argument and make a new instant of the author and store it in our a database

            resolve(parent, args) {
                //Author from our model that we imported
                //create a new instant in our database
                //we created a locale variable called and send to a new locale variable of the database
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                //we save the instant to our database
                //mongoose know how to save it because we have alrady define it in our books.js
                return author.save();
            }
        },
        AddBook: {
            type: BookGroup,
            //two argument we expect from the user when they are using the mutation add author
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            //where we take the argument THE BOOKMODEL and make a new instant of the author and store it in our a database
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        },

    }
});

//3. define our RootEntryPoint which define how to jump in in to graph:different option on how to jump in the graph:1.book(bookType, argument:id in a string) 
//efter we recieve it we are going to fire the resove fucntion that will help to grap the book from the database of some other source
//entrypoint into our data, define relationship between type
//define ripequery where we can jump it the graph and grab data

const RootEntryPoint = new GraphQLObjectType({
    name: 'RootQueryType',
    //don't need field to be a function beacuse we dont need to worry the order inside our rootquery
    fields: {
        book: {
            type: BookGroup,
            // the user need to pass an id like book(id:123) and that's how we know what book to land in and return
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //use lodash to look through the book array to find the book that have an id equal to the(args:id)that the user send along and return it
                // return _.find(books, { id: args.id });
                return Book.findById(args.id);


            }
        },
        auther: {
            type: AuthorGroup,
            // the user need to pass an id like book(id:123) and that's how we know what book to land in and return
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //use lodash to look through the book array to find the book that have an id equal to the(args:id)that the user send along and return it

                //return _.find(authors, { id: args.id });
                return Author.findById(args.id);


            }
        },
        //want all books
        books: {
            type: new GraphQLList(BookGroup),
            resolve(parent, args) {
                //return books
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorGroup),
            resolve(parent, args) {
                // return authors
                return Author.find({});

            }
        },
    }

});

//we are defining which query the user can use in the front end
//export it so we can use as property to our app.use
//when exporting our graphqlschema we are saying that a user can query using rootQuery and mutation using mutation 

module.exports = new GraphQLSchema({
    query: RootEntryPoint,
    Mutation: Mutate
});