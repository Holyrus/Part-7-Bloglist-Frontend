import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import ErrorNotification from "./components/ErrorNotification";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";

import { setNotification } from "./reducers/notificationReducer";
import { setErrorNotification } from './reducers/errorNotificationReducer'
import { useDispatch, useSelector } from "react-redux";
import { additionLike, deletingBlog, initializeBlogs, likeIncrement } from "./reducers/blogReducer";
import { createBlog } from "./reducers/blogReducer";

import { setUser } from "./reducers/userReducer"

const App = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [user, setUser] = useState(null); // Here we store the user token
  const [unauthorizedError, setUnauthorizedError] = useState(null)

  const [newBlogCreated, setNewBlogCreated] = useState(false)

  const blogFormRef = useRef();

  const dispatch = useDispatch()

  const user = useSelector(state => state.user)

  const blogs = useSelector(state => state.blogs)

  // When we enter the page, all checks if user is already logged in and can be found in local storage

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user))
      // setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

    // useEffect(() => {
    //   if (user) {
    //     blogService.getAll().then((initialBlogs) => setBlogs(initialBlogs));
    //   }
    // }, [newBlogCreated, user]);

    useEffect(() => {
      if (user) {
        dispatch(initializeBlogs())
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            setUnauthorizedError('Unauthorized')
            console.log(unauthorizedError)
          }
         })
      }
    }, [newBlogCreated, user])

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    // setUser(null);
    dispatch(setUser(null))
    dispatch(setNotification("Logged out successfully", 5));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      // If browser are refreshed, the user token will be still logged
      window.localStorage.setItem(
        "loggedBlogappUser",
        JSON.stringify(user), // Storing the user token in the local storage
      );

      blogService.setToken(user.token); // Setting the token to the blogService
      // setUser(user); // Storing the user token
      dispatch(setUser(user))
      setUsername("");
      setPassword("");
      dispatch(setNotification("Logged in successfully", 5));
      
    } catch (exception) {
      dispatch(setErrorNotification("Wrong credentials", 5));
    }
  };

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();

    dispatch(createBlog(blogObject))
    setNewBlogCreated(!newBlogCreated)
    dispatch(initializeBlogs())
    dispatch(setNotification(
        `A new blog ${blogObject.title} by ${blogObject.author} added`, 5
    ));

    // blogService.create(blogObject).then((returnedBlog) => {
    //   setBlogs(blogs.concat(returnedBlog));
    // setNewBlogCreated(!newBlogCreated)
    // dispatch(setNotification(
    //   `A new blog ${blogObject.title} by ${blogObject.author} added`, 5
    // ));
    // });
  };

  const updateBlog = (id) => {

    dispatch(likeIncrement(id))
    const currentBlog = blogs.find(blog => blog.id === id)
    dispatch(additionLike(currentBlog))

    dispatch(setNotification("Like added", 5));

    // const likedBlog = blogs.find((blog) => blog.id === id);

    // const blogObject = {
    //   ...likedBlog,
    //   likes: (likedBlog.likes += 1),
    // };

    // blogService
    //   .update(id, blogObject)
    //   .then((returnedBlog) => {
    //     setBlogs(
    //       blogs.map((blog) =>
    //         blog.id === returnedBlog.id ? returnedBlog : blog,
    //       ),
    //     );
    //     dispatch(setNotification("Like added", 5));
    //   })
    //   .catch((error) => {
    //     dispatch(setErrorNotification("Cannot add Like", error.response.data));
    //   });
  };

  const deleteBlog = (id) => {
    const blogToDelete = blogs.find((blog) => blog.id === id);

    if (
      window.confirm(
        `Remove blog ${blogToDelete.title} by ${blogToDelete.author}`,
      )
    ) {

      dispatch(deletingBlog(id))
      dispatch(setNotification("Blog removed", 5));

      // blogService
      //   .remove(id)
      //   .then(() => {
      //     setBlogs(blogs.filter((blog) => blog.id !== id));
      //     dispatch(setNotification("Blog removed", 5));
      //   })
      //   .catch((error) => {
      //     dispatch(setErrorNotification("Cannot remove blog", error.response.data));
      //   });
    }
  };

  return (
    <div>
      <h1>Blogs</h1>
      <Notification />
      <ErrorNotification />

      <Togglable buttonLabel="login">
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>

      {user !== null && unauthorizedError !== 'Unauthorized' ? (
        <div>
          <p>{user.name} logged-in</p>
          <button onClick={handleLogout}>Logout</button>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          <h2>blogs</h2>
          {blogs.length !== 0 ? (
            [...blogs]
              .sort((a, b) => b.likes - a.likes)
              .map((blog) => (
                <Blog
                  key={blog.id}
                  blog={blog}
                  updateBlog={updateBlog}
                  deleteBlog={deleteBlog}
                  user={blog.user.username}
                  canUserDelete={user.username === blog.user.username}
                />
              ))
          ) : (
            <p>No blogs</p>
          )}
        </div>
      ) : (
        <p>{unauthorizedError}</p>
      )}
    </div>
  );
};

export default App;
