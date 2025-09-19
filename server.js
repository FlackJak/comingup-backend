const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
require('dotenv').config();

const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const User = require('./models/User');

const app = express();
app.use(cors());
// Use body-parser middleware explicitly before Apollo middleware
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/comingup', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const getUser = async (token) => {
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      return await User.findById(decoded.userId);
    }
  } catch (err) {
    return null;
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization || '';
    const user = await getUser(token.replace('Bearer ', ''));
    return { req, user };
  },
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
