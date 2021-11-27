import React from 'react';
// import { Link }  from 'react-router-dom';
import styles from './Card.module.css'

const Card = ({title, icon, children}) => { // children is a special prop which consist has all the content written inside any component.
    return (
        <div className={styles.card}>
            <div className={styles.headingWrapper}>
                <img src={`/images/${icon}.png`} alt={`${icon}`} />
                <h1 className={styles.heading}>{title}</h1>
            </div>
            {children} {/* Inject the data inside the children here*/}
            
        </div>
    )
}

export default Card
