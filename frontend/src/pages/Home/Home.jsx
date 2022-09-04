import React from 'react';
import { useHistory } from 'react-router-dom'; //useHistory is a hook used for redirect/route
import styles from './Home.module.css';

import Card from '../../components/shared/Card/Card'
import Button from '../../components/shared/Button/Button'


const Home = () => {
    
    // const signInLinkStyle = {
    //     color: '#0077ff',
    //     fontWeight: 'bold',
    //     textDecoration: 'none',
    //     marginLeft: '10px'
    // };

    const history = useHistory(); // useHistory is a hook used for redirect/route

    function startRegister() {
        history.push('/authenticate'); // Push it on /register route when this function is called.
        console.log("Hey");
    }

    return (
        <div className={styles.cardWrapper}>
            <Card title="Welcome to Codersclub!" icon="logo"> 
                <p className={styles.text}>
                    We're wroking hard to get Coderclub ready for everyone! While we wrap up the finishing youches, we're adding people gradually to make sure nothing breaks.
                </p>
                <div>
                    <Button onClick={startRegister} text="Let's Go" />
                </div>
                <div className={styles.signinWrapper}>
                    <span className={styles.hasInvite}>Have an invite text?</span>
                    {/* <Link style={signInLinkStyle} to="/login">Sign in</Link> */}
                </div>
            </Card>
        </div>
    )
}

export default Home

// Since Button is a component here we can't have any eventHandler directly on it. We will have to pass the event above as prop 