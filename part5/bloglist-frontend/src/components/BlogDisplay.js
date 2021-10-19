import React, { useRef } from 'react'
import Blog from './Blog'
import AddBlogForm from './AddBlogForm'
import Togglable from './Togglable'
import { postBlog, deleteBlog, likeBlog } from '../reducers/blogsReducer'
import { notifyWith } from '../reducers/notificationReducer'
import { useDispatch, useSelector } from 'react-redux'
import {
  BrowserRouter as Router,
  Switch, Route, Link
} from 'react-router-dom'

const BlogDisplay = ({ username, handleLogout, user }) => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const toggleRef = useRef()

  const handleRemove = (blog) => {
    if (window.confirm(`Remove "${blog.title}" by ${blog.author}?`)) {
      dispatch(deleteBlog(blog))
      dispatch(notifyWith(`"${blog.title}" removed from the blogs list!`, 'success'))
    }
  }

  const handleAdd = (newBlog) => {
    dispatch(postBlog(newBlog))
    dispatch(notifyWith(`"${newBlog.title}" by ${newBlog.author} added`, 'success'))
  }

  const handleLike = (blog) => {
    // The backend returns a populated user field (mongoose method)
    // when we send GET requests to api/blogs.
    // However, when we send PUT request we need to omit those
    // populated fields or we get 400 Bad requests
    let updatedBlog = { ...blog, likes: blog.likes + 1 , user: blog.user.id }
    dispatch(likeBlog(updatedBlog))
    dispatch(notifyWith(`Liked "${blog.title}"!`, 'success'))
  }

  return (
    <div className='bloglist'>
      <h1>Blog List Application</h1>
      <p>{username} is logged in {' '}
        <button onClick={handleLogout}>Logout</button>
      </p>
      <Router>
        <Switch>
          <Route exact path="/">
            <Link to="/users"><p>Users</p></Link>
            <Togglable buttonLabel="Add a new Blog" ref={toggleRef}>
              {/*
                pass toggleRef as a ref to Togglable
                but as a prop to AddBlogForm
              */}
              <AddBlogForm handleAdd={handleAdd} toggleRef={toggleRef} />
            </Togglable>
            <h2>Existing blogs</h2>
            {blogs.map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                user={user}
                handleLike={() => handleLike(blog)}
                handleRemove={() => handleRemove(blog)}/>)}
          </Route>
          <Route path="/users">
            <Link to="/"><p>Blogs</p></Link>
            <h1>Users</h1>
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default BlogDisplay