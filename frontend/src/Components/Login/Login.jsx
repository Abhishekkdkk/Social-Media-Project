import React from 'react'
import styled from 'styled-components'
import Button from '../Button'
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";

function Login() {
  return (
    <Boss>
        <div className="left">
            <div className="di">
                <h2>Social Media</h2>
                <p>The most popular Student2Student Site</p>
                <Button text="Read More"/>  
            </div>
             
        </div>

        <Logs>
            <div className="header">
                <h3>Hello Again!</h3>
                <p>Welcome Back</p>
            </div>

            <div className="infos">
                <div className='info'>
                    <MdEmail />
                    <input type='email' placeholder='Email Address'/>
                </div>
                <div className="info">
                    <FaLock />
                    <input type='password' placeholder='Password'/>
                </div>  
            </div>
            <Button text="Login"/>
            <div className="forget">
                <p><a href=''>Forget password</a></p>
            </div>

        </Logs>

        
    </Boss>
  )
}

export default Login
const Boss = styled.div`
  width: 90%;
  height: 90vh;
  margin: 30px auto;
  display: flex;
  border-radius: 20px;
  overflow: hidden;
  color: white;
  background: #e6e6e6;

  .left {
    flex: 1.2;
    background: linear-gradient(to top left, #0574E4, #021E7C);
    display: flex;
    align-items: center;
    padding-left: 12%;
    padding-right: 8%;
  }

  .left .di h2 {
    font-size: 38px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .left p {
    font-size: 15px;
    margin-bottom: 20px;
  }
`;
const Logs = styled.form`
  flex: 1;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;

  .header {
    text-align: center;
    color: #222;
    margin-bottom: 30px;

    h3 {
      font-size: 28px;
      font-weight: 700;
    }

    p {
      font-size: 15px;
      color: #555;
      margin-top: 6px;
    }
  }

  .infos {
    width: 100%;
    max-width: 350px;
    margin-bottom: 20px;
  }

  .info {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f3f3f3;
    padding: 8px 15px;
    border-radius: 20px;
    margin-bottom: 15px;
    color: #555;
    font-size: 18px;
    border: 1px solid rgba(0,0,0,0.1);
}
    
    

    svg {
      font-size: 22px;
      color: #C8C8C8;
    }

    input {
      width: 100%;
      border: none;
      outline: none;
      background: none;
      font-size: 13px;
      color: #555555;
    }
  

  button {
    width: 100%;
    max-width: 350px;
    margin-top: 10px;
    margin-bottom: 15px;
    cursor: pointer;
    padding: 12px 15px;
  }

  .forget {
    font-size: 14px;

    a {
      color: #555;
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: #0574E4;
      }
    }
  }
`;
