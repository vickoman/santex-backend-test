const {
    auth,
    createUser,
    getUsers,
    getMe
} = require('../models/User/resolvers');

// Resolvers
const resolvers = {
    Query: {
        getUsers,
        getMe
    },
    Mutation: {
        auth,
        createUser,
    }
};

module.exports = resolvers;
