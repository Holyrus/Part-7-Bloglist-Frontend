import { useSelector } from 'react-redux'

const Notification = () => {

  const notification = useSelector(state => state.notification)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: 'lightgreen'
  }

  return (
    <div>
      {notification === null ?
      <p></p>
      :
      <div style={style}>
        {notification}
      </div>
    }
    </div>
  )
};

export default Notification;
