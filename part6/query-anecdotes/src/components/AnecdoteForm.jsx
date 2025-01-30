//components/AnecdoteForm.jsx
import { useMutation } from '@tanstack/react-query'
import { createAnecdote } from '../requests'



const AnecdoteForm = () => {

  const newAnecdoteMutation = useMutation({
    
    mutationFn: createAnecdote,
    onError: (error) => {

      dispatch({ type: 'SHOW', payload: 'Error: anecdote too short!' })
      setTimeout(() => dispatch({ type: 'HIDE' }), 5000)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({ type: 'SHOW', payload: 'Anecdote added!' })
      setTimeout(() => dispatch({ type: 'HIDE' }), 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content })
  }


  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
