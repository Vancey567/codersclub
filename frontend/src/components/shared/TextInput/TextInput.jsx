import React from 'react'
import styles from './TextInput.module.css'

const TextInput = (props) => {
    return (
        <div>
            <input 
                className={styles.input} 
                // style={{
                //     width: props.fullwidth === 'true' ? '100%' : 'inherit',
                // }} 
                type="text" 
                {...props} /> {/* All the passed prop will be spread and applied here.*/}
        </div>
    )
}

export default TextInput
