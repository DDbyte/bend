//components/AnecdoteList.js

import { useSelector, useDispatch } from 'react-redux'
import { createSelector } from '@reduxjs/toolkit'
import { useEffect } from 'react'
import { initializeAnecdotes, voteAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

// Memoized selector
const selectSortedAnecdotes = createSelector(
  (state) => state.anecdotes,
  (anecdotes) => [...anecdotes].sort((a, b) => b.votes - a.votes)
)

const AnecdoteList = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [dispatch])

  // Use memoized selector
  const anecdotes = useSelector(selectSortedAnecdotes)

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote))
    dispatch(showNotification(`You voted '${anecdote.content}'`, 5))
  }

  return (
    <div>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id} className="anecdote">
          <div className="anecdote-content">{anecdote.content}</div>
          <div className="anecdote-votes">
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
