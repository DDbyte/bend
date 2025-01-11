// import mongoose
const mongoose = require('mongoose')

//retrive pass
const password = process.argv[2]

//conn str
const url = `mongodb+srv://alex:${password}@cluster0.exhnn.mongodb.net/testAppBlog?retryWrites=true&w=majority&appName=Cluster0`
  

//config mongoose
mongoose.set('strictQuery',false)

//db conn
mongoose.connect(url)

//define schema
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
});

// define model based on schema
const Blog = mongoose.model('Blog', blogSchema)

//based on conditions, display all docs, add new doc to db, or exit w/ code 1
if(process.argv.length === 3){
  console.log('Blog-list:')
  Blog.find({}).then(result => {
    result.forEach(blog => {
      console.log(`${blog.title} - ${blog.author}- ${blog.url} - ${blog.likes}`)
    })
    //an open database connection keeps the event loop alive, preventing the script from exiting
    mongoose.connection.close()
  })
}
else if(process.argv.length === 7){
  const blog = new Blog({
    title: process.argv[3],
    author: process.argv[4],
    url: process.argv[5],
    likes: process.argv[6],
  })
  blog.save().then(() => {
    console.log(`added to testBlogApp`)
    mongoose.connection.close()
  })
}
else{
  console.log('err')
  process.exit(1)
}