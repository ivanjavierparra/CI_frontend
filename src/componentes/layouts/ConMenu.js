import React from 'react'
import { Route } from 'react-router-dom'



import Header from '../base/Header';
import Menu from '../base/Menu';
import Footer from '../base/Footer';
import MenuDerecho from '../base/MenuDerecho';

const ConMenu = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={props => (
            <div>
            <Header/>
            <Menu/>
                <Component {...props} />
            <Footer/>
            <MenuDerecho/>
            </div>
        )} />
    )
}

export default ConMenu