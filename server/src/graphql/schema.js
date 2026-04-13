const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type User {
    id: Int!
    firstName: String!
    lastName: String!
    email: String!
    role: String!
    isVerified: Boolean
    isActive: Boolean
  }

  type Listing {
    id: Int!
    title: String!
    city: String!
    district: String
    price: Int!
    genderPreference: String!
    description: String!
    isActive: Boolean!
    User: User
  }

  type MessageResponse {
    message: String!
  }

  input RegisterInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ListingInput {
    title: String!
    city: String!
    district: String
    price: Int!
    genderPreference: String!
    description: String!
  }

  type Query {
    me: User
    publicListings(search: String, city: String, genderPreference: String): [Listing!]!
    adminListings: [Listing!]!
    adminUsers: [User!]!
  }

  type Mutation {
    register(input: RegisterInput!): MessageResponse!
    login(input: LoginInput!): User!
    logout: MessageResponse!
    createListing(input: ListingInput!): Listing!
    updateListing(id: Int!, input: ListingInput!): Listing!
    deleteListing(id: Int!): MessageResponse!
    toggleListingActive(id: Int!): Listing!
  }
`);