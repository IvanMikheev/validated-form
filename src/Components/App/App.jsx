import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import FormContainer from '../FormContainer/FormContainer'
import ListView from '../ListView/ListView';
import './App.css'

export class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <header className="app-header">
            <h2>Какой-то заголовок</h2>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
              <ul className="navbar-nav mr-auto">
                <li><Link to={'/'} className="nav-link "> Внесение данных </Link></li>
                <li><Link to={'/view'} className="nav-link">Просмотр данных</Link></li>
              </ul>
            </nav>
          </header>
          <Switch>
            <Route exact path='/' component={FormContainer} />
            <Route path='/view' component={ListView} />
          </Switch>
        </div>
      </Router>

    )
  }
}

export default App
