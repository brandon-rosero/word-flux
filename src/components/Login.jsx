import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import "../css/signup.css"
import { AuthContext } from '../AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState();

  //const {setUser} = useContext(AuthContext)

  const navigate = useNavigate();

  function getUserInfo(){
    fetch("http://127.0.0.1:5000/api/login", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',    
        },
        body: JSON.stringify({email: email, password: password}),
        credentials: 'include',
    }).then(res => res.json()).then(data => setMessage(data['message']))

  }

  useEffect(() =>{  
    console.log(message)
    if(message == "Login successful"){
      fetch("http://127.0.0.1:5000/api/me", {
        method: 'GET',  
        credentials: 'include'
      }).then(res => res.json()).then(data => console.log(data))
      navigate('/search')
    }
    else if(message == "Invalid input"){
        toast.error('Wrong email/password', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
    }  
    setMessage("")
})   

  const handleSubmit = (e) => {
    e.preventDefault();
  }
  
  return (
    <div className='sign-up-container'>
            <form onSubmit={handleSubmit}>
                <h2 className='logo-label'>WordFlux</h2>
                <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                <input type="text" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
                <button className='sign-up-button' type='submit' onClick={getUserInfo}>Log in</button> 
            </form>
            <div className='existing-account'>
                <h6>
                    Don't have an account? 
                    <Link to="/signup">
                        <span className='login-span'> Sign up</span>
                    </Link>     
                </h6>   
            </div>
            <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
        </div> 
  )
}

export default Login