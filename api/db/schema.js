const {  gql } = require('apollo-server');

// Schema definition
const typeDefs = gql`
    type Token {
        token: String 
    }

    input AuthInput {
        email: String!
        password: String!
    }

    input UserInput {
        name: String
        lastName: String
        email: String
        password: String
    }
    type User {
        id: ID
        name: String
        lastName: String
        email: String
        created_at: String
    }

    type League {
        id: ID
        name: String
        code: String
        areaName: String
    }

    input LeagueInput {
        name: String!
        code: String!
        areaName: String!
    }

    type Query {
        getUsers: [User]
        getMe: User

        # Leagues
        getAllLeague: [League]
    }
    # Mutations
    type Mutation {
        # Users
        createUser(input: UserInput!) : User

        #Auth
        auth(input: AuthInput!) : Token

        # Leagues
        importLeague(leagueCode: String!) : League
    }
`;

module.exports = typeDefs;
