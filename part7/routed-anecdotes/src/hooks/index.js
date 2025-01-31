//hooks/index.js

import { useState } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  // Return an object that can be spread into input elements
  return {
    type,
    value,
    onChange,
    reset,
    inputprops: {
      type,
      value,
      onChange,
    },
  };
}
