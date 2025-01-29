//components/Filter.jsx

// Filter.js

import { useDispatch } from 'react-redux'
import { setFilter } from '../reducers/filterReducer'

const Filter = () => {
  const dispatch = useDispatch()

  const handleChange = (event) => {
    dispatch(setFilter(event.target.value))
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Filter anecdotes..."
        onChange={handleChange}
      />
    </div>
  )
}

export default Filter

