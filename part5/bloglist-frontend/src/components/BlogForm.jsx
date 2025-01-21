// components/BlogForm.jsx
import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog(newBlog)
    setNewBlog({ title: '', author: '', url: '' })
    toggleVisibility()
  }

  return (
    <div>
      {visible ? (
        <div>
          <h3>Create New Blog</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title">Title:</label>
              <input
                id="title"
                value={newBlog.title}
                onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}
              />
            </div>
            <div>
              <label htmlFor="author">Author:</label>
              <input
                id="author"
                value={newBlog.author}
                onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}
              />
            </div>
            <div>
              <label htmlFor="url">URL:</label>
              <input
                id="url"
                value={newBlog.url}
                onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
              />
            </div>
            <button type="submit">Add Blog</button>
            <button type="button" onClick={toggleVisibility} style={{ marginLeft: '10px' }}>
              Cancel
            </button>
          </form>
        </div>
      ) : (
        <button onClick={toggleVisibility}>Create New Blog</button>
      )}
    </div>
  )
}

export default BlogForm