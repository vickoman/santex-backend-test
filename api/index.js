const { ApolloServer, gql} = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const dbConnection = require('./config/db');
const RedisQueue = require('./config/queue');
const jwt = require('jsonwebtoken');
const { createUserDefault } = require('./models/User/resolvers');
const { importPlayers } = require('./models/Player/resolver');
require('dotenv').config({ path: '.env'});
const REDIS_URI = process.env.REDIS_URI ? process.env.REDIS_URI : "redis://localhost:6379"
// Connect with Database
dbConnection();
// Create Default user
createUserDefault();
// Get Player Queue
const queue = new RedisQueue(REDIS_URI);



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

// Proccesing jobs queue Team
queue.teamQueue.process(async (job) => {
    importPlayers(job);
});

//Run server
server.listen( {
    port: process.env.PORT || 4000,
}).then(({url}) => {
    console.log(`Server is running on ${url}`);
});