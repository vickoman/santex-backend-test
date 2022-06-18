const {
    auth,
    createUser,
    getUsers,
    getUser
} = require('../models/User/resolvers');

// Resolvers
const resolvers = {
    Query: {
        getUsers,
        getUser
    },
    Mutation: {
        auth,
        createUser,
    }
};

module.exports = resolvers;
