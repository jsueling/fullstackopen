require('dotenv').config()
const { ApolloServer, gql, UserInputError, AuthenticationError } = require('apollo-server')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const JWT_SECRET = process.env.SECRET_KEY

console.log('connecting to', process.env.MONGODB_URI)

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB: ', error.message)
  })

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    id: ID!
    born: Int!
    bookCount: Int
  }

  type Token {
    value: String!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    addAuthor(
      name: String!
      born: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {

      if (args.author && args.genre) {
        let author = await Author.findOne({ name: args.author })
        return await Book.find({ author: author._id, genres: args.genre }).populate('author')
      }

      if (args.genre) return await Book.find({ genres: args.genre }).populate('author')

      if (args.author) {
        let author = await Author.findOne({ name: args.author })
        return await Book.find({ author: author._id }).populate('author')
      }

      else return await Book.find({}).populate('author')
    },
    allAuthors: async () => {

      let authors = await Author.find({})

      let bookCountAuthors = authors.map( async (x) => {
        // map each author in authors to object in the type format we expressed
        // for each author asynchronously count the books that they have
        let bookCount = await Book.countDocuments({ author: x._id })
        return { 
          id: x._id.toString(),
          bookCount,
          name: x.name,
          born: x.born
        }
      })

      return bookCountAuthors
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {

      if (!context.currentUser) throw new AuthenticationError('You must be logged in to add a book')
      // Find author ID from string args.author
      let author = await Author.findOne({ name: args.author })
      // Append author ID to document
      let book = new Book({ ...args, author: author._id.toString() })
      // save document
      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }

      // populate author field
      return book.populate('author')
    },
    addAuthor: async (root, args) => {
      
      const author = new Author({ ...args })

      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidaArgs: args
        })
      }

      return author
    },
    editAuthor: async (root, args, context) => {

      if (!context.currentUser) throw new AuthenticationError('You must be logged in to edit an Author')

      let author = await Author.findOne({ name: args.name })

      if (!author) throw new UserInputError('that Author does not exist in the database')

      let editedAuthor = { ...author._doc, born: args.setBornTo }

      return await Author.findByIdAndUpdate(author._id, editedAuthor, { new: true })
    },
    createUser: (root, args) => {

      const user = new User({ ...args })

      return user.save()
      .catch(error => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})