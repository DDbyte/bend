
//components/Notification.js

import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setNotification, removeNotification } from '../reducers/notificationReducer'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  const dispatch = useDispatch()

  if (notification) {
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000)
  }

  const style = {
    border: 'solid',
    padding: 20,
    borderWidth: 1,
    backgroundColor: 'yellow',
    borderRadius: '5px',
    color: 'black'
  }

  return (
    notification ? (
      <div style={style}>
        {notification}
      </div>
    ) : null
  )
}

export default Notification
