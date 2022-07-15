import React, { Component, Fragment } from 'react';
import axios from 'axios';
import {useEffect} from 'react'
import Dashboard from './components/Dashboard';
import { Provider} from 'react-redux';
import store from './store';


class App extends Component {
  // Initialize App
  // useEffect(() => {}, [])

  // getItems(){
  //   fetch('http://localhost:8000/api/images/')
  //   .then(results => results.json())
  //   .then(results => console.log(results));

  // }

  

  render() {
    return (
      <Provider store={store}>
        <Fragment>
          <div className='container'>
              <Dashboard/>
          </div>
        </Fragment>
      </Provider>

    );
  }
}

export default App;