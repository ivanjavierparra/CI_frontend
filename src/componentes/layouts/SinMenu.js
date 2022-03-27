import React from 'react'
import { Route } from 'react-router-dom'



import Header from '../base/Header';
import Menu from '../base/Menu';
import Footer from '../base/Footer';
import MenuDerecho from '../base/MenuDerecho';

const SinMenu = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={props => (
            
            
                <Component {...props} />
            
            
        )} />
    )
}

export default SinMenu