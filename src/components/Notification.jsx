import { useSelector } from 'react-redux'

const Notification = () => {

  const notification = useSelector(state => state.notification)

  return (
    <div>
      {notification === null ?
      <p></p>
      :
      <div>
        {notification}
      </div>
    }
    </div>
  )
};

export default Notification;
