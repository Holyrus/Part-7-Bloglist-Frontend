import { createSlice } from "@reduxjs/toolkit";

const errorNotificationSlice = createSlice({
  name: 'errorNotification',
  initialState: null,
  reducers: {
    addErrorNotification(state, action) {
      return action.payload
    },
    resetErrorNotification(state, action) {
      return null
    }
  }
})

export const setErrorNotification = (text, seconds) => {
  return dispath => {
    setTimeout(() => {
      dispath(resetErrorNotification())
    }, seconds * 1000)
    dispath(addErrorNotification(text))
  }
}

export const { addErrorNotification, resetErrorNotification } = errorNotificationSlice.actions
export default errorNotificationSlice.reducer