import { useState } from 'react'
import { useField } from './hooks'
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, NavLink } from 'react-router-dom'
import './App.css';


const Menu = () => {
  return (
    <div className="menu">
      <NavLink to="/" end>Anecdotes</NavLink>
      <NavLink to="/create">Create</NavLink>
      <NavLink to="/about">About</NavLink>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => (
        <li key={anecdote.id}>
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      ))}
    </ul>
  </div>
)

const Anecdote = ({ anecdotes }) => {
  const { id } = useParams();
  const anecdote = anecdotes.find(a => a.id === Number(id));

  if (!anecdote) return <p>Anecdote not found!</p>

  return (
    <div>
      <h2>{anecdote.content}</h2>
      <p>by {anecdote.author}</p>
      <p>has {anecdote.votes} votes</p>
      <p>For more info, see <a href={anecdote.info}>{anecdote.info}</a></p>
    </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>
    <em>An anecdote is a brief, revealing account...</em>
    <p>Software engineering is full of excellent anecdotes...</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href="https://fullstackopen.com/">Full Stack Open</a>.
    See <a href="https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js">GitHub</a> for the source code.
  </div>
)

const CreateNew = ({ addNew }) => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    })

    navigate('/')
  }

  const handleReset = (e) => {
    e.preventDefault()
    content.reset()
    author.reset()
    info.reset()
  }

  return (
    <div>
      <h2>Create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content <input {...content.inputprops} />
        </div>
        <div>
          author <input {...author.inputprops} />
        </div>
        <div>
          url for more info <input {...info.inputprops} />
        </div>
        <button type='submit'>create</button>
        <button type='button' onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}


const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    { content: 'If it hurts, do it more often', author: 'Jez Humble', info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html', votes: 0, id: 1 },
    { content: 'Premature optimization is the root of all evil', author: 'Donald Knuth', info: 'http://wiki.c2.com/?PrematureOptimization', votes: 0, id: 2 }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))

    setNotification(`A new anecdote "${anecdote.content}" created!`)
    setTimeout(() => setNotification(''), 5000)
  }

  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />
        {notification && <p style={{ color: 'green' }}>{notification}</p>}
        <Routes>
          <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route path="/create" element={<CreateNew addNew={addNew} />} />
          <Route path="/about" element={<About />} />
          <Route path="/anecdotes/:id" element={<Anecdote anecdotes={anecdotes} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
