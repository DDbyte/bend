//useResource.js

import { useState, useEffect } from 'react'
import axios from 'axios'

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  // Fetch all resources when the hook is used
  useEffect(() => {
    axios.get(baseUrl)
      .then(response => setResources(response.data))
      .catch(error => console.error(`Error fetching data from ${baseUrl}:`, error))
  }, [baseUrl])

  // Function to create a new resource
  const create = async (resource) => {
    try {
      const response = await axios.post(baseUrl, resource)
      setResources(resources.concat(response.data)) // Add new resource to state
    } catch (error) {
      console.error(`Error creating resource at ${baseUrl}:`, error)
    }
  }

  // Return an array: the first item is the list of resources, the second is the service object
  return [resources, { create }]
}

export default useResource
