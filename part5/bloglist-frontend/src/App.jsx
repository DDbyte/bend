
//App.jsx

import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Footer from './components/Footer'
import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: '' })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs => setBlogs(blogs))
    }
  }, [user])

  const addBlog = (event) => {
    event.preventDefault()
    blogService
      .create(newBlog)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewBlog({ title: '', author: '', url: '' })
        showNotification(`A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`, 'success')
      })
      .catch(() => showNotification('Error adding blog', 'error'))
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      showNotification(`Welcome ${user.username}`, 'success')
    } catch (exception) {
      showNotification('Wrong credentials', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
    setBlogs([])
    showNotification('Logged out successfully', 'success')
  }

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: null, type: '' }), 5000)
  }

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        Title:
        <input
          value={newBlog.title}
          onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}
        />
      </div>
      <div>
        Author:
        <input
          value={newBlog.author}
          onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}
        />
      </div>
      <div>
        URL:
        <input
          value={newBlog.url}
          onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
        />
      </div>
      <button type="submit">Add Blog</button>
    </form>
  )

  return (
    <div>
      <Notification message={notification.message} type={notification.type} />
      <h2>Blogs</h2>

      {!user && (
        <form onSubmit={handleLogin}>
          <div>
            Username:
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            Password:
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      )}

      {user && (
        <div>
          <p>{user.username} logged in <button onClick={handleLogout}>Logout</button></p>
          {blogForm()}
          {blogs.map(blog => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}

      <Footer />
    </div>
  )
}

export default App
