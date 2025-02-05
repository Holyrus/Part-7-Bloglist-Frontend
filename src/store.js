import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from './reducers/notificationReducer'
import errorNotificationReducer from './reducers/errorNotificationReducer'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    errorNotification: errorNotificationReducer
  }
})

export default store