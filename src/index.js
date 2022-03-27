import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import store from "./store/index";
import { Provider } from "react-redux";
import axios from 'axios';
import cookie from 'js-cookie';
import jwt from 'jsonwebtoken';

// Este valor me lo da Laravel en el .env
const jwt_secret = 'EHp0LbgZjki4iTVAhXhXe6RDveltatcoyzJ3idKCGp4lidT6OZ7P2ZHknzxPRLq4';

// Verifico si hay un token en las cookies, lo decodifico a partir del secreto.
let token = cookie.get("token");
if (token) {
    jwt.verify(token, jwt_secret, (err, decoded) => {
      if (err) {
        cookie.remove("token");
        token = null;
        console.log("decoded",decoded);
      } else {
        if (decoded.iss !== "http://localhost:8000/api/auth/login") {
          cookie.remove("token");
          token = null;
        }
      }
    });
  }
  

// Defino render como una función
const render = () => {
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById("root")
    );
};

// Si el token existe, entonces le pido a Laravel mis datos de usuario.
if (token) {
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
axios.post("http://localhost:8000/api/auth/me").then(res => {
    store.dispatch({ type: "SET_LOGIN", payload: res.data });
    render();
});
} else {
render();
}
  


    
// ReactDOM.render(<App />, document.getElementById('root'));



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
// https://learnwithparam.com/blog/how-to-pass-props-in-react-router/