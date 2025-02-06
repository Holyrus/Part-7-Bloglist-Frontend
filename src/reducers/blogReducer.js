import { createSlice, current } from "@reduxjs/toolkit";
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    likeIncrement(state, action) {
      const id = action.payload
      const blogToChange = state.find(b => b.id === id)
      const changedBlog = {
        ...blogToChange,
        likes: blogToChange.likes + 1
      }
      console.log(current(state))
      return state.map(blog => blog.id !== id ? blog : changedBlog)
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map(b => b.id !== updatedBlog.id ? b : updatedBlog)
    },
    removeBlog(state, action) {
      return state.filter(blog => blog.id !== action.payload)
    }
  }
})

export const { setBlogs, appendBlog, likeIncrement, updateBlog, removeBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = content => {
  return async dispatch => {
    const newBlog = await blogService.create(content)
    dispatch(appendBlog(newBlog))
  }
}

export const additionLike = blog => {
  return async dispatch => {
    const updatedBlog = await blogService.addLike(blog)
    dispatch(updateBlog(updatedBlog))
  }
}

export const deletingBlog = id => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch(removeBlog(id))
  }
}

export default blogSlice.reducer