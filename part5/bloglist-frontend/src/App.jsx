// App.jsx
import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
//import LoginForm from './components/LoginForm';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import Footer from './components/Footer';
import './App.css';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({ message: null, type: '' });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    if (user) {
      //blogService.getAll().then((blogs) => setBlogs(blogs));
      blogService.getAll().then((blogs) => {
        setBlogs(blogs.sort((a, b) => b.likes - a.likes))
      });
    }
  }, [user,blogs]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
      showNotification(`Welcome ${user.username}`, 'success');
    } catch (exception) {
      showNotification('Wrong credentials', 'error');
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser');
    blogService.setToken(null);
    setUser(null);
    setBlogs([]);
    showNotification('Logged out successfully', 'success');
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: null, type: '' }), 7000);
  };

  const addBlog = (newBlog) => {
    blogService
      .create(newBlog)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog));
        showNotification(`A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`, 'success');
      })
      .catch(() => showNotification('Error adding blog', 'error'));
  };

  const updateBlogLikes = (updatedBlog) => {
    blogService
      .update(updatedBlog.id, updatedBlog)
      .then((returnedBlog) => {
        setBlogs(blogs.map((blog) => (blog.id === returnedBlog.id ? returnedBlog : blog)));
        //setBlogs(blogs.map((blog) => (blog.id === returnedBlog.id ? { ...returnedBlog, user: blog.user } : blog)));
        showNotification(`You liked "${returnedBlog.title}"`, 'success');
      })
      .catch(() => showNotification('Error updating likes', 'error'));
  };

  const deleteBlog = (id) => {
    blogService
      .remove(id)
      .then(() => {
        setBlogs(blogs.filter((blog) => blog.id !== id));
        showNotification('Blog removed successfully', 'success');
      })
      .catch(() => showNotification('Error deleting blog', 'error'));
  };

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
          <p>
            {user.username} logged in <button onClick={handleLogout}>Logout</button>
          </p>
          <BlogForm createBlog={addBlog} />
          {blogs.map((blog) => (            
            <Blog key={blog.id} blog={blog} updateBlogLikes={updateBlogLikes} deleteBlog={deleteBlog} user={user} />
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
};//

export default App;
