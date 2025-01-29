//reducers/filterReducer.js

const filterReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return action.payload
    default:
      return state
  }
}

// Action creator
export const setFilter = (filter) => ({
  type: 'SET_FILTER',
  payload: filter,
})

export default filterReducer
