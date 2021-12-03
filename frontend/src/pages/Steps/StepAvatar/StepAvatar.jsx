import React, { useState } from 'react'
import Card from '../../../components/shared/Card/Card'
import Button from '../../../components/shared/Button/Button'
import { setAvatar } from '../../../store/activateSlice'
import { useSelector, useDispatch } from 'react-redux'
import { activate } from '../../../http'
import { setAuth } from '../../../store/authSlice' 

import styles from './StepAvatar.module.css'
 
const StepAvatar = ({onNext}) => {
    const dispatch = useDispatch();
    const { name, avatar } = useSelector((state) => state.activate);
    const [image, setImage] = useState('/images/monkey-avatar.png');
    
    async function submit() {
        try {
            const { data } = await activate({ name, avatar }); // we will send the data and avatar to the server post url
            if(data.auth) { // if it is true that is the user is avtivated then
                dispatch(setAuth(data))
            }
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    }

    function captureImage(e) {
        const file = e.target.files[0]; // This will give us the file at 0th index inside the target when we choose a file
        // Using browser inbuilt api we will convert the image into base 64 string from the file format. Then we can add this string inside our <img src attribute> which will display the image
        const reader = new FileReader(); // FileReader is inbuilt api
        reader.readAsDataURL(file);// read the file. IT takes time to read the file so we need to something only when we have read the entire file. for that we get a callback function named onloadend()
        reader.onloadend = function() { // this is an anonymous function
            setImage(reader.result); // Update our local state and We will get the processed base 64 string inside reader.result
            dispatch(setAvatar(reader.result)); // add the image inside the store so that even if we revert back from stepAvatar we will still have the image inside the store to fetch it and display it.
        }
        // Now we have the name and userImage the user so now we need to create a route to post these data on the server on click of next button. And we need to make the activate field as true cuz the user is activated now
    }
    
    return (
        <>
            <Card title={`Okay, ${name}`} icon="monkey-emoji">
                    <p className={styles.subHeading}>How's this photo?</p>                    
                    <div className={styles.avatarWrapper}>
                        <img className={styles.avatarImage} src={image} alt="avatar" />
                    </div>
                    <div>
                        <input type="file" className={styles.avatarInput} id="avatarInput" onChange={captureImage}/>
                    </div>
                    <label className={styles.avatarLabel} htmlFor="avatarInput">Choose a different file</label>
                    <div>
                        <Button onClick={submit} text="Next" /> {/* we will submit the data(name, image) we got from the user and store it on server on click of submit button */}
                    </div>
            </Card>
        </>
    )
}

export default StepAvatar
