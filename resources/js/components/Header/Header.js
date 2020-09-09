import React from "react";
import 'header.css';
import Logo from './Logo.svg';

const Header = () => {
    return (
        <div className='header__wrapper'>
            <img className='header__logo' src={Logo} />
        </div>
    );
}

export default Header;
