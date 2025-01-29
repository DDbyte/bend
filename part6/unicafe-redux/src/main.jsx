
//main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import counterReducer from './reducer'
import './main.css'


const store = createStore(counterReducer)

const App = () => {
  const good = () => store.dispatch({ type: 'GOOD' })
  const ok = () => store.dispatch({ type: 'OK' })
  const bad = () => store.dispatch({ type: 'BAD' })
  const reset = () => store.dispatch({ type: 'ZERO' })

  return (
    <div>
      <h2>Give Feedback</h2>
      <button onClick={good}>good</button>
      <button onClick={ok}>ok</button>
      <button onClick={bad}>bad</button>
      <button onClick={reset}>reset stats</button>

      <h3>Statistics</h3>
      <div>good {store.getState().good}</div>
      <div>ok {store.getState().ok}</div>
      <div>bad {store.getState().bad}</div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

renderApp()
store.subscribe(renderApp)
