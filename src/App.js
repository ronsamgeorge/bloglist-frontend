import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user,setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('logging in with',username, password);

    try{
      const userInfo = await loginService.login({username,password});
      setUser(userInfo);
      setUsername('');
      setPassword('');

    } catch(exception){
      console.log('invalid credentials')
    }
  }

  const loginForm = () => {
    return(
      <form onSubmit={handleLogin}>
      <h2>Login Form</h2>
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
    )
  }

  const blogComponent = () =>{
    return(
      <div>
        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  }

  return (
    <div>
      {user === null ? loginForm() : blogComponent()}
    </div>
  )
}

export default App
