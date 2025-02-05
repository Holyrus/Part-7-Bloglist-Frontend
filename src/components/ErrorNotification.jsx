import { useSelector } from 'react-redux'

const ErrorNotification = () => {
  
  const errorNotification = useSelector(state => state.errorNotification)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: 'red'
  }

  return (
    <div>
      {errorNotification === null ?
      <p></p>
      :
      <div style={style}>
        {errorNotification}
      </div>
    }
    </div>
  )
};

export default ErrorNotification;
