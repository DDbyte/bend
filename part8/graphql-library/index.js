

const { ApolloServer } = require('@apollo/server');
//const { startStandaloneServer } = require('@apollo/server/standalone');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";


// Load environment variables
dotenv.config();

const Book = require('./models/Book');
const Author = require('./models/Author');


mongoose.set('strictQuery', false);

const MONGODB_URI = process.env.MONGODB_URI;
console.log('connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  type Query {
    bookCount: Int
    authorCount: Int
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(title: String!,published: Int!, author: String!,  genres: [String!]!): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, password: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => await Book.countDocuments(),
    authorCount: async () => await Author.countDocuments(),
    allBooks: async (_, args) => {
      let query = {};
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (author) {
          query.author = author._id;
        } else {
          return [];
        }
      }
      if (args.genre) {
        query.genres = args.genre;
      }
      return Book.find(query).populate('author');
    },
    allAuthors: async () => {
      const authors = await Author.find({});
      return authors.map(async (author) => {
        const bookCount = await Book.countDocuments({ author: author._id });
        return { ...author.toObject(), bookCount };
      });
    }
  },

  Mutation: {
    addBook: async (_, args) => {
      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = new Author({ name: args.author });
        await author.save();
      }
      const book = new Book({ ...args, author: author._id });
      await book.save();
      return book.populate('author');
    },

    editAuthor: async (_, args) => {
      return await Author.findOneAndUpdate(
        { name: args.name },
        { born: args.setBornTo },
        { new: true }
      );
    },

    // User Registration
    createUser: async (_, args) => {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(args.password, saltRounds);

      const user = new User({
        username: args.username,
        passwordHash,
        favoriteGenre: args.favoriteGenre
      });

      try {
        await user.save();
      } catch (error) {
        throw new Error("Username must be unique");
      }

      return user;
    },

    // User Login
    login: async (_, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user) {
        throw new Error("Invalid username or password");
      }

      const passwordCorrect = await bcrypt.compare(args.password, user.passwordHash);
      if (!passwordCorrect) {
        throw new Error("Invalid username or password");
      }

      const userForToken = {
        username: user.username,
        id: user._id
      };

      return { value: jwt.sign(userForToken, JWT_SECRET, { expiresIn: "1h" }) };
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const express = require('express');
const { json } = require('body-parser');

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(json());

  // Start Apollo Server before using it
  await server.start();

  // Middleware to extract user from JWT
  app.use(async (req, res, next) => {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith("Bearer ")) {
      const token = auth.substring(7);
      try {
        req.user = jwt.verify(token, JWT_SECRET);
      } catch (err) {
        console.error("Invalid token");
      }
    }
    next();
  });

  app.use('/graphql', expressMiddleware(server));

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/graphql`);
  });
}

startServer().catch(error => console.error('Error starting server:', error));
