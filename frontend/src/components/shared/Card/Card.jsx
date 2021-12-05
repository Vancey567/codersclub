import React from 'react';
// import { Link }  from 'react-router-dom';
import styles from './Card.module.css'

const Card = ({title, icon, children}) => { // children is a special prop which consist has all the content written inside any component.
    return (
        <div className={styles.card}>
            <div className={styles.headingWrapper}>
                { icon && <img src={`/images/${icon}.png`} alt={`${icon}`} /> } {/* If the icon has beed passed then only show the image else don't show it */}
                { title && <h1 className={styles.heading}>{title}</h1> }
            </div>
            {children} {/* Inject the data inside the children here*/}
            
        </div>
    )
}

export default Card
