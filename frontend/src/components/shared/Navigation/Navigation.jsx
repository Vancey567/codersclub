import React from 'react';
import { Link } from 'react-router-dom'; //  this Link will create a link for us. It gives a link tag Which doesnot allows the page to refresh while the normal anchor tag <a href=""> refreshes the page.

import styles from './Navigation.module.css'; // The module styles are written available only inside the current component but not in it's child or parent or any other component. Here <Link> is a child component, so module.css will not be applied to <Link>. To solve this we will have to use inline styling.


const Navigation = () => {
    //  Inline style: In React you create a object and you will write all the css inside it there only difference is in "Naming". And the style are like key value pair. Where "values" are inside a string
    const brandStyle = {
        color: '#fff',
        textDecoration: 'none',// instead of text-decoration we will write "textDecoration" as key cuz in JavaScript - is not allowed
        fontWeight: 'bold',
        fontSize: '22px',
        display: 'flex',
        alignItems: 'center',
    }

    const logoText = {
        marginLeft: '10px'
    }

    return (
        <nav className={`${styles.navbar} container`}> {/* To import/write multiple class you need to use backtick and write the name of the css varibale inside ${} and write normal class outside ${} */}
            <Link style={brandStyle} to="/"> {/* This creates a link on to the logo image and when you click on that logo it will take you to the homepage or the passed route */}
                <img src="/images/logo.png" alt="logo" />
                <span style = {logoText}>Codersclub</span>
            </Link>
        </nav>
    )
}

export default Navigation
