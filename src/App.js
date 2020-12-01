import React, {useState, useEffect, useContext} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './components/dashboard';
import { useCookies } from 'react-cookie'
import { URLContext } from '.'

function App() {
  const [authToken, setAuthToken, removeAuthToken] = useCookies(["auth-token"])
  const [username, setUsername, removeUsername] = useCookies(["username"])
  const [isHost, setIsHost] = useState(false)
  const APIURL = useContext(URLContext)

  const checkIfHost = () => {
    fetch(`${APIURL.URL}/host/`,{
      method : "GET",
      headers : {
        "Content-Type" : "application/json",
        'Accept': 'application/json',
        "Authorization" : `Token ${authToken["auth-token"]}`
      }
    })
    .then(
      (res) => {
        let status = res.status
        if(status === parseInt(200)){
          setIsHost(true)
        }else{
          setIsHost(false)
        }
      }
    )
    .catch(error => console.log(error))
  }
  const getUserName = () => {
    fetch(`${APIURL.URL}/username/`,{
      method : "GET",
      headers : {
        "Content-Type" : "application/json",
        'Accept': 'application/json',
        "Authorization" : `Token ${authToken["auth-token"]}`
      }
    })
    .then(res => res.json())
    .then(res => setUsername("username", res[0]["name"]))
    .catch(error => console.log(error))
  }
  useEffect(()=>{
    getUserName()
  },[]);
  useEffect(()=>{
    checkIfHost()
  },[]);
  useEffect(()=>{
    if(!authToken["auth-token"]){
      window.location.href = '/'
    }
  }, [authToken])
  const logout = () => {
    removeAuthToken(["auth-token"]);
    removeUsername(["username"])
  }
  return (
    <Dashboard token={authToken["auth-token"]} isHost={isHost} logout={logout}/>
  );
}

export default App;
