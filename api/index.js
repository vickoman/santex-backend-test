const { ApolloServer, gql} = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const dbConnection = require('./config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env'});

// Connect with Database
dbConnection();

// Inicializar servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        const token = req.headers['authorization'] || '';
        if(token) {
            try {
                const user = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET);
                return { user };
            } catch (err) {
                console.log(err);
                return new Error(err);
            }
        }
    }
});


//Run server
server.listen( {
    port: process.env.PORT || 4000,
}).then(({url}) => {
    console.log(`Server is running on ${url}`);
});