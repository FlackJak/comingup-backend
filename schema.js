const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    enrolledCourses: [Course!]!
    wishlist: [Course!]!
  }

  type Course {
    id: ID!
    title: String!
    description: String!
    price: Float!
    instructor: User!
    category: String!
    tags: [String!]!
    rating: Float
    reviews: [Review!]!
  }

  type Review {
    id: ID!
    user: User!
    course: Course!
    rating: Int!
    comment: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    courses: [Course!]!
    course(id: ID!): Course
    me: User
    users: [User!]! # Admin only
    user(id: ID!): User # Admin only
    myCourses: [Course!]! # Instructor only
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!

    createCourse(title: String!, description: String!, price: Float!, category: String!, tags: [String!]!): Course!
    updateCourse(id: ID!, title: String, description: String, price: Float, category: String, tags: [String!]): Course!
    deleteCourse(id: ID!): Boolean!

    enroll(courseId: ID!): String!

    addReview(courseId: ID!, rating: Int!, comment: String): Review!
    updateReview(id: ID!, rating: Int, comment: String): Review!
    deleteReview(id: ID!): Boolean!

    addToWishlist(courseId: ID!): Boolean!
    removeFromWishlist(courseId: ID!): Boolean!

    createUser(name: String!, email: String!, password: String!, role: String!): User! # Admin only
    updateUser(id: ID!, name: String, email: String, role: String): User! # Admin only
    deleteUser(id: ID!): Boolean! # Admin only

    processPayment(courseId: ID!, paymentMethod: String!): String! # Mocked payment

    sendNotification(userId: ID!, message: String!): Boolean! # Mocked notification
  }

  type Wishlist {
    id: ID!
    user: User!
    courses: [Course!]!
  }
`;

module.exports = typeDefs;
