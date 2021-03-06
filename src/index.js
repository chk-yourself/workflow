import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import 'normalize.css';
import './index.scss';
import { App } from './pages/App';
import * as serviceWorker from './serviceWorker';
import { FirebaseContext } from './components/Firebase';
import store, { firebase, history } from './store';

ReactDOM.render(
  <Provider store={store}>
    <FirebaseContext.Provider value={firebase}>
      <Router basename={process.env.PUBLIC_URL} history={history}>
        <App />
      </Router>
    </FirebaseContext.Provider>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
