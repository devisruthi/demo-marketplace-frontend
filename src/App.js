import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';

import AppContext from './AppContext';
import LayoutRoute from './LayoutRoute';
import PrivateRoute from './PrivateRoute';
import HomeScreen from './HomeScreen';
import AboutScreen from './AboutScreen';
import RegistrationScreen from './RegistrationScreen';
import LoginScreen from './LoginScreen';
import ProfileScreen from './ProfileScreen';

const App = () => {

  const [globalState, setGlobalState] = useState(
    {
      loggedIn: localStorage.getItem('jwt') ? true : false,
      profile: null
    }
  )

  useEffect(
    () => {
      // if there is a token and globalState.profile is null
      if (localStorage.getItem('jwt') && globalState.profile === null) {
        // fetch GET to get profile details
        fetch(
          `${process.env.REACT_APP_BACKEND}/users/profile`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
          }
        )
          .then(
            (backendResponse) => backendResponse.json()
          )
          .then(
            (json) => {
              console.log('user\'s profile', json)
              // update the globalState.profile
              setGlobalState(
                {
                  ...globalState,
                  profile: json
                }
              )
            }
          ).catch(
            error => console.log(error)
          )
      }
    },
    [globalState.loggedIn]
  )

  return (
    <AppContext.Provider value={[globalState, setGlobalState]}>
      <BrowserRouter>
        <Switch>
          <LayoutRoute path="/" exact={true} component={HomeScreen} />
          <LayoutRoute path="/about" exact={true} component={AboutScreen} />
          <LayoutRoute path="/register" exact={true} component={RegistrationScreen} />
          <LayoutRoute path="/login" exact={true} component={LoginScreen} />
          <PrivateRoute path="/profile" exact={true} component={ProfileScreen} />
        </Switch>
      </BrowserRouter>
    </AppContext.Provider>
  )
}

export default App;