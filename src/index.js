import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Auth from './components/Auth'
import * as serviceWorker from './serviceWorker';
import { Route, BrowserRouter} from 'react-router-dom';
import {  CookiesProvider } from 'react-cookie'

export const URLContext = createContext()

function Router(){
	///const URL = 'https://decathlonbangladeshcnc.herokuapp.com/api'
	URL = 'http://127.0.0.1:8000/api'
	return (
		<React.StrictMode>
			<URLContext.Provider value={{URL}}>
			<CookiesProvider>
					<BrowserRouter>
						<Route exact path="/" component={Auth}/>
						<Route exact path="/dashboard" component={App}/>
					</BrowserRouter>
			</CookiesProvider>
			</URLContext.Provider>
		</React.StrictMode>
	)
}

ReactDOM.render(
  	<Router/>,
  	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
