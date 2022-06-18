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

    # Mutations
    type Mutation {
        #Auth
        auth(input: AuthInput!) : Token
    }
`;

module.exports = typeDefs;
