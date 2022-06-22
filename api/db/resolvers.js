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

const {
    getAllTeams
} = require('../models/Team/resolvers');

// Resolvers
const resolvers = {
    Query: {
        getUsers,
        getMe,
        getAllLeague,
        getAllTeams
    },
    Mutation: {
        auth,
        createUser,
        importLeague
    }
};

module.exports = resolvers;
