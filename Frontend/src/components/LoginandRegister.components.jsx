import { useState, useEffect } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import {LoginService, SignupService} from "../services/LoginandRegister.services.js"
import {useNavigate} from 'react-router-dom';
import './LoginandRegister.css'

function Log() {
    let navigate = useNavigate()
    let [loginstatus, setloginstatus] = useState({loggedin : false})
    useEffect(() => {
        if(loginstatus.loggedin) {
            navigate('/home')
            return
        }
    }, [loginstatus])

    let [email, setemail] = useState('')
    let [password, setpassword] = useState('')
    let [showpw, setshowpw] = useState(false)

    async function handleLogin(e) {
        e.preventDefault()
        if(!email) { setloginstatus(prevstatus => ({...prevstatus, message : 'Email cannot be empty'})); return }
        let emailregex = '/^[^/s@.]+@[^/s.@]+.[^/s@.]+'
        if(!emailregex.test(email)) {setloginstatus(prevstatus => ({...prevstatus, message : 'Enter valid email'})); return}
        if(!password) { setloginstatus(prevstatus => ({...prevstatus, message : 'Password must be entered'})); return }
        try{
        let status = await LoginService(email, password)
        setloginstatus(status)
        } catch(e) {setloginstatus(prev => ({...prev, message : e.message}))}
    }

    return (
        <form onSubmit = {handleLogin} className = 'logs'>
            <input className = 'emailinp' type = 'email' value = {email} onChange = {e => setemail(e.target.value)} placeholder ='Email'/>
            <div className = 'eyetoggle'>
            <input className = 'pw' type = {showpw? 'text' : 'password'} value = {password} onChange = {e => setpassword(e.target.value)} placeholder = 'Password'/>
            {password && (
                <button type = 'button' onClick = {() => setshowpw((val) => !val)} className = 'pweye'>
                {showpw? <FaEye /> : <FaEyeSlash />}
                </button>
                )
            }
            </div>
            <span className = 'errmsg'>{loginstatus.message}</span>
            <button type = 'submit' className = "login" >Log In</button>
        </form>
    )
}

function Signup() {
    let navigate = useNavigate()
    let [signupstatus, setsignupstatus] = useState({loggedin : false})
    useEffect(() => {
        if(signupstatus.loggedin) {
            navigate('/home')
            return
    }
    }, [signupstatus])

    let [username, setusername] = useState('')
    let [email, setemail] = useState('')
    let [password, setpassword] = useState('')
    let [confirmpw, setconfirmpw] = useState('')
    let [avatar, setavatar] = useState(null)
    let [showpw, setshowpw] = useState(false)
    let [showconfirmpw, setshowconfirmpw] = useState(false)
    
    async function handleSignup(e) {
        e.preventDefault()
        if(!username) { setsignupstatus(prevstatus => ({...prevstatus, message : 'Username cannot be empty'})); return }
        if(!email) { setsignupstatus(prevstatus => ({...prevstatus, message : 'Email cannot be empty'})); return }
        let emailregex = /^[^\s@.]+@[^\s.@]+\.[^\s@.]+$/
        if(!emailregex.test(email)) {setloginstatus(prevstatus => ({...prevstatus, message : 'Enter valid email'})); return}
        if(!password) { setsignupstatus(prevstatus => ({...prevstatus, message : 'Password cannot be empty'})); return }
        if(!confirmpw) { setsignupstatus(prevstatus => ({...prevstatus, message : 'Confirm password cannot be empty'})); return }
        if(password !== confirmpw) { setsignupstatus(prevstatus => ({...prevstatus, message : 'Confirm password should be same as password'})); return }
        if(!avatar) { setsignupstatus(prevstatus => ({...prevstatus, message : 'Avatar must be uploaded'})); return}
        
        try{
        let status = await SignupService(username, email, password, avatar)
        setsignupstatus(status)
        } catch(e) {setsignupstatus(prev => ({...prev, message : e.message}))}
    }

    return (
        <form onSubmit = {handleSignup} className = 'sign'>
            <input className = 'username' type = 'text' value = {username} onChange = {e => setusername(e.target.value)} placeholder = 'Username'/>
            <input className = 'emailsgn' type = 'email' value = {email} onChange = {e => setemail(e.target.value)} placeholder = 'Email'/>
            <div className = 'eyetoggle'>
            <input className = 'pw' type = {showpw? 'text' : 'password'} value = {password} onChange = {e => setpassword(e.target.value)} placeholder = 'Password'/>
            {password && (
                <button className = 'pweye' type = 'button' onClick = {() => setshowpw((val) => !val)}>
                {showpw? <FaEye /> : <FaEyeSlash />}
                </button>
            )
            }
            </div>
            <div className = 'eyetoggle'>
            <input className = 'pw' type = {showconfirmpw? 'text' : 'password'} value = {confirmpw} onChange = {e => setconfirmpw(e.target.value)} placeholder = 'Confirm Password'/>
            {confirmpw && (
                <button className = 'pweye' type = 'button' onClick = {() => setshowconfirmpw((val) => !val)}>
                {showconfirmpw? <FaEye /> : <FaEyeSlash />}
            </button>
            )
            }
            </div>

            <input className = 'avatar' type = 'file' onChange = {e => setavatar(e.target.files[0])} accept = 'image/*'/>
            <span className="avt">{avatar && avatar.name}</span>
            <span className = 'errmsg'>{signupstatus.message}</span>
            <button type = 'submit' className = "signup">Sign Up</button>
        </form>
    )
}

function Login() {
    let [signup, setsignup] = useState(false)
    return (
        <div className = {signup ? 'signbody' : 'logbody'}>
            {signup ? <Signup /> : <Log />}
            
            <button onClick = {() => setsignup(prev => !prev)} className = 'togglereg'>{signup ? 'Already have account? Login' : 'Create new account'}</button>
            
            </div>
    )
}

export default Login