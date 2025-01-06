//
const dummy = (blogs) => {
    return 1;
  }
  
//
const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum+blog.likes, 0)
}

//
const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null;  
    
    const favorite = blogs.reduce((max, blog) => {
      return blog.likes > max.likes ? blog : max
    }, blogs[0])  
    
    return {
      title: favorite.title,
      author: favorite.author,
      likes: favorite.likes,
    }
  }

//
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;
  //count blogs by author
  const autCount = blogs.reduce((count, blog) =>{
    count[blog.author] = (count[blog.author] || 0) +1
    return count
  }, {})
  //author w/ most blogs
  const authMostBlogs = Object.keys(autCount).reduce((max, author) => {
    return autCount[author] > autCount[max] ? author: max
  })
  return {
    author: authMostBlogs,
    blogs:autCount[authMostBlogs]
  }
}
  
//
const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {author: null, likes: 0}
  }

  // map authors and their total likes
  const auLtike = blogs.reduce((likes, blog) => {
    likes[blog.author] = (likes[blog.author] || 0) + blog.likes
    return likes;
  }, {});

  //find the author w/ most likes
  const authMostLikes = Object.entries(auLtike).reduce((max, [author, likes]) => {
    return likes > max.likes ? { author, likes } : max
  }, { author: null, likes: 0 })

  return authMostLikes
}

//export
module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
  }