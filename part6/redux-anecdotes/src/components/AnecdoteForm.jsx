//components/AnecdoteForm.js

import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const createAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.elements.anecdote.value
    dispatch(addAnecdote(content))
    dispatch(setNotification(`You added a new anecdote: "${content}"`))
    event.target.elements.anecdote.value = ''
  }

  return (
    <form onSubmit={createAnecdote}>
      <input name="anecdote" placeholder="Enter new anecdote..." />
      <button className="create-button">create</button>
    </form>
  )
}

export default AnecdoteForm

