//components/AnecdoteForm.js
import { useDispatch } from 'react-redux'
import { createNewAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const createAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.elements.anecdote.value
    dispatch(createNewAnecdote(content))
    dispatch(showNotification(`You added a new anecdote: "${content}"`, 7))
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




