import React from 'react';
import { Link } from 'react-router-dom'; //  this Link will create a link for us. It gives a link tag Which doesnot allows the page to refresh while the normal anchor tag <a href=""> refreshes the page.
import { logout } from '../../../http/index'
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../../../store/authSlice' 

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


    const dispatch = useDispatch();
    const { isAuth, user } = useSelector((state) => state.auth); // We need to check the status of is auth from the state. and a/c we will render the logout. For that we will get the useSelector hook to read data from the state. Inside the useSelector() method we get the state and from that state we need to access the correct slice(here "auth") and inside that we have a isAuth property we need to get it by destructure=ing it.


    async function logoutUser() {
        // request for logout.
        try {
            const { data } = await logout(); // we will send empty data from the server so that we can use the same data. We will get the data in response when we will logout.
            dispatch(setAuth(data));
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <nav className={`${styles.navbar} container`}> {/* To import/write multiple class you need to use backtick and write the name of the css varibale inside ${} and write normal class outside ${} */}
            <Link style={brandStyle} to="/"> {/* This creates a link on to the logo image and when you click on that logo it will take you to the homepage or the passed route */}
                <img src="/images/logo.png" alt="logo" />
                <span style = {logoText}>Codersclub</span>
            </Link>

            {isAuth && 
                <div className={styles.navRight}>
                    <h3>{user.name}</h3>
                    <Link to="/">
                        <img className={styles.avatar} src={user.avatar} width="40" height="40" alt="avatar" />
                    </Link>
                    <button className={styles.logoutButton} onClick={logoutUser}>
                        <img src="/images/logout.png" alt="logout" />
                    </button>
                </div>
            }
            
             {/* { isAuth && <button onClick={logoutUser}>Logout</button> } This is called short Circuit i.e if the isAuth is true then only it will show the button else won't show anything */}
        </nav>
    )
}

export default Navigation
