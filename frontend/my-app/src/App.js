import React, {useContext, useReducer} from 'react';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//import Button from 'react-bootstrap/Button';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';




import login from './pages/Login1';
import signup from './pages/Signup';
import logout from './pages/Logout';

import Store from './store/store';
import rootReducer from './rootReducer/rootReducer';


const  App = () => {
   const initState = useContext(Store);
   const [state, dispatch] = useReducer(rootReducer, initState);


  return (
    <>
    <Store.Provider value={{state,dispatch}} >
      <div className="App">
      <Router>
        
        <Switch>
          {/* <Route exact path = '/home' component ={home} /> */}
          <Route path = '/login' component = {login} />
          <Route path = '/logout' component = {logout} />
          <Route path = '/signup' component = {signup} />
          
          
          {/* <Route path = '/logout' component = {logout} /> */}
          
        </Switch>
      </Router>
      </div>
    </Store.Provider>  
    </>
  );
}

export default App;
