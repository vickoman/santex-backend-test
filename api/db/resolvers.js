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
    getPlayersByLeague
} = require('../models/Player/resolver');

const {
    getAllTeams,
    getTeamByName
} = require('../models/Team/resolvers');

// Resolvers
const resolvers = {
    Query: {
        getUsers,
        getMe,
        getAllLeague,
        getAllTeams,
        getTeamByName,
        getPlayersByLeague
    },
    Mutation: {
        auth,
        createUser,
        importLeague
    }
};

module.exports = resolvers;
