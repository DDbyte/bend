
//reducers/anecdoteReducer.js

import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    updateAnecdote(state, action) {
      const updated = action.payload
      return state.map(anecdote =>
        anecdote.id === updated.id ? updated : anecdote
      )
    }
  }
})

export const { setAnecdotes, appendAnecdote, updateAnecdote } = anecdoteSlice.actions

// Async action creators
export const initializeAnecdotes = () => async (dispatch) => {
  const anecdotes = await anecdoteService.getAll()
  dispatch(setAnecdotes(anecdotes))
}

export const createNewAnecdote = (content) => async (dispatch) => {
  const newAnecdote = await anecdoteService.createAnecdote(content)
  dispatch(appendAnecdote(newAnecdote))
}

export const voteAnecdote = (anecdote) => async (dispatch) => {
  const updatedAnecdote = await anecdoteService.voteAnecdote(anecdote)
  dispatch(updateAnecdote(updatedAnecdote))
}

export default anecdoteSlice.reducer
