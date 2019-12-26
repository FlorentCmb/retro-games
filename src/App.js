// Import librairies
import React from 'react'
import { Switch, Route } from 'react-router-dom'

// Import screens & components
import Pong from './screens/Pong'
import Snake from './screens/Snake'
import TestGame from './screens/TestGame'
import TestGame2 from './screens/TestGame2'
import Header from './components/Header'

// Import styles
import './App.css'

const App = () => {

  return (
    <div className="App">
      <Header />
      <Switch>
        <Route path="/pong">
          <Pong />
        </Route>
        <Route path="/snake">
          <Snake />
        </Route>
        <Route exact path="/test/1">
          <TestGame />
        </Route>
        <Route exact path="/test/2">
          <TestGame2 />
        </Route>
      </Switch>
    </div>
  )
}

export default App