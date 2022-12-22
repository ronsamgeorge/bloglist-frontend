import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login';
import NewNoteForm from './components/NewNoteForm';

const Notification = ({message}) => {
  if(message === null){
    return null;
  }
  return (
    <div className='error'>
      {message}
    </div>
  )
}

const Heading = ({displayText}) => {
  return(
      <h2>{displayText}</h2>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user,setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [notification, setNotification] = useState(null);
  const [formVisible, setFormVisible] = useState(false);


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  // check for logged in user in Local Storage
  useEffect(() => {
    const loggedInUserInfo = window.localStorage.getItem('loggedInUser');
    if (loggedInUserInfo){
      blogService.setToken(JSON.parse(loggedInUserInfo).jwtUserToken)  // setting token value for local saved login
      setUser(JSON.parse(loggedInUserInfo));                          
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('logging in with',username, password);

    try{
      const userInfo = await loginService.login({username,password});
      window.localStorage.setItem('loggedInUser', JSON.stringify(userInfo));
      console.log(userInfo);
      blogService.setToken(userInfo.jwtUserToken);
      setUser(userInfo);
      setUsername('');
      setPassword('');
    } catch(exception){
      setNotification('invalid credentials')
    }
  }

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedInUser');  // clears the local storage 
    setUser(null);                                   // resets user state to null and will render login 
  }


  const handlePost = (event) => {
    event.preventDefault();
    console.log("posting blog ...");

    const newBlog = {
      author,
      title,
      url
    }

    console.log(newBlog);
    blogService.postBlog(newBlog)
      .then(returnedNote => {
        setBlogs(blogs.concat(returnedNote));
        setAuthor('');
        setTitle('');
        setUrl('');

        setNotification('Blog Posted');
        setTimeout(() => {
          setNotification(null)
        },5000);


      }).catch(err => {
        setNotification(err.message)
        setTimeout(() => {
          setNotification(null)
        },5000);
      })
  }

  // Render the form when new Blog button is clicked
  const noteForm = () => {
    const hideWhenVisible = {display : formVisible ? 'none' : ''};
    const showWhenVisible = { display : formVisible ? '' : 'none'};
    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={()=> setFormVisible(true)}>Add New Blog</button>
        </div>

        <div style={showWhenVisible}>
        <NewNoteForm 
          handlePost={handlePost}
          title={title}
          author={author}
          url={url}
          handleTitle={({target}) => setTitle(target.value)}
          handleAuthor={({target}) => setAuthor(target.value)}
          handleUrl = {({target}) => setUrl(target.value)}
        />
        <button onClick={()=>setFormVisible(false)}>Cancel</button>
        </div>
      </div>
    )
  }
  
  if(user===null){
    return(
      <div>
        <Notification message={notification}/>
        <form onSubmit={handleLogin}>
        <Heading displayText='login' />
        <div>
          username
          <input 
            type='text'
            value={username}
            onChange={({target}) => setUsername(target.value)}>
          </input>
        </div>

        <div>
          password
          <input
          type='password'
          value={password}
          onChange={({target}) => setPassword(target.value)}>
          </input>
        </div>
        <button type='submit'>Login</button>
      </form>
      </div>
      
    )
  }

  return(
    <div>
        <Notification message={notification} />
        <h2>blogs</h2>
        <p>{user.name} logged in</p>
        <button onClick={handleLogout}>logout</button>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
        
        {noteForm()}
       
      
      </div>
  )
}

export default App
