import './App.css';
import { Routes, Route, Navigate, useNavigate, } from 'react-router-dom'
import Register from './pages/Register/Register';
import Header from './components/Header/Header';
import Profile from './pages/Profile/Profile';
import Auth from './pages/Auth/Auth';

import { useEffect, useState } from 'react';
import { AddContext } from './Context';

function App() {

  const [renderUser, setRenderUser] = useState({
		id: '',
		username: '',
		avatar: '',
		about: '',
		email: '',
	})


  const [checkUser, setCheckUser] = useState(false)
  let navigate = useNavigate();

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'))
    if (!token) {
      setCheckUser(false)
      console.log('ok')
      return navigate("/regis");
    } else {
      setCheckUser(true)
      return navigate("/");
    }
  }, [checkUser])


  
  return (
    <>
    <AddContext.Provider
    value={{renderUser , setRenderUser}}
    >
        <Header />
        <Routes>
          <Route path='/' element={<Profile/>} />
          <Route path='/regis' element={<Register />} />
          <Route path='/login' element={<Auth />}></Route>
          <Route path='*' element={<h1>ERROR 404</h1>}/>
        </Routes>
    </AddContext.Provider>
    
    </>

  );
}

export default App;
