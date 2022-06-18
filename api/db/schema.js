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

    type Query {
        getUsers: [User]
        getMe: User
    }
    # Mutations
    type Mutation {
        # Users
        createUser(input: UserInput!) : User

        #Auth
        auth(input: AuthInput!) : Token
    }
`;

module.exports = typeDefs;
