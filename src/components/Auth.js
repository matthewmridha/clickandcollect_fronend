import React, {useState, useEffect, useContext} from 'react'
import { Form,  Button, Card} from 'react-bootstrap'
import { trackPromise } from 'react-promise-tracker';
import LoadingIndicator from "./LoadingIndicator";
import { useCookies } from 'react-cookie'
import { URLContext } from '..';
const Auth = () => {
    const [authToken, setAuthToken] = useCookies(["auth-token"])
    const [username, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
    const [forgotPasswordToken, setForgotPasswordToken] = useState("")
    const [newPassword1, setNewPassword1] = useState("")
    const [newPassword2, setNewPassword2] = useState("")
    const [passwordResetEmailSent, setPasswordResetEmailSent] = useState(false)
    const [passwordResetEmailInput, setPasswordResetEmailInput] = useState(false)
    const APIURL = useContext(URLContext)
    const login = (e) => {
        e.preventDefault();
        const url = `https://decathlonbangladeshcnc.herokuapp.com/auth/`
        ///const url = 'http://127.0.0.1:8000/auth/'
        trackPromise(
            fetch(url, {
              method : "POST",
              headers : {
                "Content-Type" : "application/json",
                'Accept': 'application/json',
              },
              body : JSON.stringify({
                username : username,
                password : password,
                
              })
            })
            .then(res => res = res.json())
            .then(res => {
                if(res.token){
                    setAuthToken("auth-token", res.token)
                }
                else{
                    alert("Wrong Username or Password")
                }
            })
            .catch(err => console.log(err))
          )
        setUserName("")
        setPassword("")
    }

    useEffect(()=>{
        if(authToken["auth-token"]){
            window.location.href = './dashboard'
        }
    })
    const passwordResetEmail = () => {
        setPasswordResetEmailInput(!passwordResetEmailInput)
    }
    const getPasswordResetToken = (e) => {
        e.preventDefault();
        trackPromise(
            fetch(`${APIURL.URL}/password_reset/reset_password/`,{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    'Accept': 'application/json',
                    
                },
                body : JSON.stringify({"email":forgotPasswordEmail} )  
            })
            .then((res) => {
                if(res.status === 200){
                    setPasswordResetEmailSent(true);
                    setPasswordResetEmailInput(false);
                }
                else{
                    alert(`ERROR ${res.status}`)
                }
                console.log(res)
            })
            .catch(err => alert(err))
        )
    }
    const resetPassword = (e) => {
        e.preventDefault();
        console.log(forgotPasswordToken)
        console.log(newPassword1)
        if(newPassword1 === newPassword2){
            trackPromise(
                fetch(`${APIURL.URL}/password_reset/confirm/`,{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    'Accept': 'application/json',
                    
                },
                body : JSON.stringify({
                    "token":forgotPasswordToken,
                    "password":newPassword1
                })  
            })
            .then((res) => {
                if(res.status === 200){
                    setPasswordResetEmailSent(false)
                    alert("Your Password has been reset. Please Login with new password")
                }
            })
            .catch(err => console.log(err))
            )
        }else{
            alert("Password 1 and 2 must match")
        }

    }
    
    return(
        <div  style={{display: "flex", alignItems:"center",justifyContent:"center", height:"100vh"}}>
            <LoadingIndicator/>
            <Card>
                <Card.Body>
                    <Card.Title>Login</Card.Title>
                    <Form onSubmit={login}>
                        <Form.Group controlId="username">
                            <Form.Label>Username:</Form.Label>
                            <Form.Control   type="text"
                                            onChange={ e => setUserName(e.target.value)}
                                            placeholder="username"
                                            value={username}
                                            required
                            />
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control   type="password"
                                            onChange={ e => setPassword(e.target.value)}
                                            placeholder="password"
                                            value={password}
                                            required
                            />
                        </Form.Group>
                        <input type="submit" className="btn btn-primary btn-block" value="Login"/>
                    </Form>
                    <Button variant="secondary" onClick={passwordResetEmail} block>Forgot Passord</Button>
                    {passwordResetEmailInput ?
                    <Form onSubmit={getPasswordResetToken}> 
                        <Form.Group controlId="resetPasswordEmail">
                            <Form.Control   type="email"
                                            onChange={ e => setForgotPasswordEmail(e.target.value)}
                                            placeholder="Email Address"
                                            value={forgotPasswordEmail}
                            />
                            <input type="submit" className="btn btn-primary btn-block" value="Email Password Reset Token"/>
                        </Form.Group>
                    </Form> : null}
                    {passwordResetEmailSent ? 
                        <Form onSubmit={resetPassword} id="resetPasswordConfirm">
                            <Form.Group controlId="token">
                                <Form.Control   type="text"
                                                onChange={ e => setForgotPasswordToken(e.target.value)}
                                                placeholder="Token"
                                                value={forgotPasswordToken}
                                                required
                                />
                            </Form.Group>
                            <Form.Group controlId="password1">
                                <Form.Control   type="password"
                                                onChange={ e => setNewPassword1(e.target.value)}
                                                placeholder="Password"
                                                value={newPassword1}
                                                required
                                />
                            </Form.Group>
                            <Form.Group controlId="password2">
                                <Form.Control   type="password"
                                                onChange={ e => setNewPassword2(e.target.value)}
                                                placeholder="Confirm Pssword"
                                                value={newPassword2}
                                                required
                                />
                            </Form.Group>
                                <input type="submit" className="btn btn-primary btn-block" value="Reset Passwrod"/>
                        </Form>
                    : null
                    }
                    
                </Card.Body>
            </Card>
        </div>
    )
}

export default Auth