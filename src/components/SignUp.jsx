import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from "react-router-dom";
import "../css/signup.css"
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { AuthContext } from '../AuthContext';


const SignUp = () => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState();

    //const {setUser} = useContext(AuthContext)

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    function setUserInfo(){
        fetch("http://127.0.0.1:5000/api/signup", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',    
            },
            credentials: 'include',
            body: JSON.stringify({email: email, password: password})
        }).then(res => res.json()).then(data => setMessage(data['message']))
    }

    useEffect(() =>{  
        console.log(message)
        if(message == "User created"){
            fetch("http://127.0.0.1:5000/api/me", {
                method: 'GET',  
                credentials: 'include'
            }).then(res => res.json()).then(data => console.log(data))
            navigate('/search')
        }
        else if(message == "email exists"){
            toast.error('Email already exists', {
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
  
    return (
        <div className='sign-up-container'>
            <form onSubmit={handleSubmit}>
                <h2 className='logo-label'>WordFlux</h2>
                <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                <input type="text" placeholder="Create password" value={password} onChange={e => setPassword(e.target.value)}/>
                <button className='sign-up-button' type='submit' onClick={setUserInfo}>Sign Up</button> 
            </form>
            <div className='existing-account'>
                <h6>
                    Already have an account? 
                    <Link to="/login">
                        <span className='login-span'> Log in</span>
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

export default SignUp