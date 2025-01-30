//services/anecdotes.js

import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

// Fetch all anecdotes
const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

// Create a new anecdote
const createAnecdote = async (content) => {
  const newAnecdote = { content, votes: 0 }
  const response = await axios.post(baseUrl, newAnecdote)
  return response.data
}

// Vote for an anecdote
const voteAnecdote = async (anecdote) => {
  const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
  const response = await axios.put(`${baseUrl}/${anecdote.id}`, updatedAnecdote)
  return response.data
}

export default { getAll, createAnecdote, voteAnecdote }
