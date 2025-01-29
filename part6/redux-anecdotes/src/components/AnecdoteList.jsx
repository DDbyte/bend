//components/AnecdoteList.js

import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import { createSelector } from 'reselect'

// Memoized selector for sorted anecdotes
const selectSortedAnecdotes = createSelector(
  (state) => state.anecdotes,  // Get anecdotes from state
  (anecdotes) => [...anecdotes].sort((a, b) => b.votes - a.votes) // Sort by votes
)

const AnecdoteList = () => {
  const anecdotes = useSelector(selectSortedAnecdotes) // Use the memoized selector
  const dispatch = useDispatch()

  const vote = (id) => {
    dispatch(voteAnecdote(id))
    dispatch(setNotification(`You voted for the anecdote: "${id}"`))
  }

  return (
    <div>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id} className="anecdote">
          <div className="anecdote-content">{anecdote.content}</div>
          <div className="anecdote-votes">
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
