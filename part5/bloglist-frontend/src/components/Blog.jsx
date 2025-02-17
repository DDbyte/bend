// components/Blog.jsx
import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlogLikes, deleteBlog, user }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible)
  }

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }
    updateBlogLikes(updatedBlog)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  return (
    <div className="blog">
      <div className="blog-title-author">
        {blog.title} by {blog.author}
        <button onClick={toggleDetails} style={{ marginLeft: '10px', color: 'yellow' }} className="toggle-details">
          {detailsVisible ? 'Hide' : 'View'}
        </button>
      </div>
      {detailsVisible && (
        <div style={{ marginTop: '10px' }} className="blog-details">
          <p>URL: {blog.url}</p>
          <p className='likes-count'>Likes: {blog.likes} <button onClick={handleLike} style={{ marginTop: '10px', background:'orange', color:'black' }} className="like-button">Like</button></p>
          <p>User: {blog.user?.name || 'Unknown'}</p>
          {user && blog.user?.username === user.username && (
            <button onClick={handleDelete} style={{ marginTop: '10px', background:'red', color:'black' }} className="delete-button">Remove</button>
          )}
        </div>
      )}
    </div>
  )
}

//prop-types, if the passed props do not match the specified types, React will show a warning in the console during dev
Blog.propTypes = { blog: PropTypes.shape({ id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired, author: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired, likes: PropTypes.number }).isRequired, updateBlogLikes: PropTypes.func.isRequired, deleteBlog: PropTypes.func.isRequired, user: PropTypes.shape({ username: PropTypes.string.isRequired, name: PropTypes.string }),
}//


export default Blog