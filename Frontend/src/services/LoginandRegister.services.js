import axios from 'axios'


async function LoginService(email, password) {
    try {
        let res = await axios.post('http://localhost:3000/api/users/login',
            {email, password},
            {withCredentials : true})
            if (!res.data.success) return {loggedin : false, message : res.data.message}
            return {loggedin : true} 
    }
    catch(e) {
        return {loggedin : false, message : e.response?.data?.error || e.message}
    }
}

async function SignupService(username, email, password, avatar) {
    let formData = new FormData()
    formData.append('username', username)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('avatar', avatar)

    try {
        let res = await axios.post('http://localhost:3000/api/users/register',
            formData,
            {withCredentials : true}
        )
        if (!res.data.success) return {loggedin : false, message : res.data.message}
        return {loggedin : true} 
    }
    catch(e) {
        return {loggedin : false, message : e.response?.data?.error || e.message}
    }
}

export  {LoginService, SignupService}