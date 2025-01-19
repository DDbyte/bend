// components/Blog.jsx
import { useState } from 'react';

const Blog = ({ blog, updateBlogLikes, deleteBlog, user }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
  };

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };
    updateBlogLikes(updatedBlog);
  };

  const handleDelete = () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      deleteBlog(blog.id);
    }
  };

  return (
    <div className="blog">
      <div>
        {blog.title} by {blog.author}
        <button onClick={toggleDetails} style={{ marginLeft: '10px', color: 'yellow' }}>
          {detailsVisible ? 'Hide' : 'View'}
        </button>
      </div>
      {detailsVisible && (
        <div style={{ marginTop: '10px' }}>
          <p>URL: {blog.url}</p>
          <p>Likes: {blog.likes} <button onClick={handleLike} style={{ marginTop: '10px', background:'orange', color:'black' }}>Like</button></p>
          <p>User: {blog.user?.name || 'Unknown'}</p>
          {user && blog.user?.username === user.username && (
            <button onClick={handleDelete} style={{ marginTop: '10px', background:'red', color:'black' }}>Remove</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;