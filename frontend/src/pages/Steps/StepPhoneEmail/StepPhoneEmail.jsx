import React, { useState } from 'react';

import Phone from './Phone/Phone';
import Email from './Email/Email';

import styles from './StepPhoneEmail.module.css';

// Creating hashmap
const phoneEmailMap = {
    phone: Phone,
    email: Email,
}

const StepPhoneEmail = ({ onNext }) => {
    const [type, setType] = useState('phone');// By default phone will be there
    const Component = phoneEmailMap[type]; // By default the type variable will contain the value "phone" using which we can get the compnent from the hashmap and assigne it to the "Component" 
    
    return (
        // When you click on any below button Phone or email the setType will change the type to phone and email in the above "Component" variable and that component will be rendered on the screen. 
        <>
            <div className={styles.cardWrapper}>
                <div>
                    <div className={styles.buttonWrap}>
                        <button className={`${styles.tabButton} ${type === "phone" ? styles.active : '' }`} onClick={() => setType('phone')}>
                            <img src="/images/phone-white.png" alt="phone" />
                        </button>
                        <button className={`${styles.tabButton} ${type === "email" ? styles.active : ''}`} onClick={() => setType('email')}>
                            <img src="/images/mail-white.png" alt="mail" />
                        </button>
                    </div>
                    <Component onNext={ onNext }/>
                </div>
            </div>
        </>
    )
}

export default StepPhoneEmail
