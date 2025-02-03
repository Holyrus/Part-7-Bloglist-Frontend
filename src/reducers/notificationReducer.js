import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    addNotification(state, action) {
      return action.payload
    },
    resetNotification(state, action) {
      return null
    }
  }
})

export const setNotification = (text, seconds) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(resetNotification())
    }, seconds * 1000)
    dispatch(addNotification(text))
  }
}

export const { addNotification, resetNotification } = notificationSlice.actions
export default notificationSlice.reducer