const {
    auth,
    createUser,
    getUsers,
    getMe
} = require('../models/User/resolvers');

const {
    importLeague,
    getAllLeague
} = require('../models/League/resolvers');

// Resolvers
const resolvers = {
    Query: {
        getUsers,
        getMe,
        getAllLeague
    },
    Mutation: {
        auth,
        createUser,
        importLeague
    }
};

module.exports = resolvers;
