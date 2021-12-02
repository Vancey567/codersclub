import React, { useState } from 'react';
import Card from '../../../../components/shared/Card/Card';
import Button from '../../../../components/shared/Button/Button';
import TextInput from '../../../../components/shared/TextInput/TextInput';
import { sendOtp } from '../../../../http/index';// Since we have exported only the otp endpoint and not the export default the entire file module there for we need to import the function inside {  }  
import { useDispatch } from 'react-redux'; // 
import { setOtp } from '../../../../store/authSlice';// Since we have exported only the otp endpoint and not the export default the entire file module there for we need to import the function inside {  }  

import styles from './Phone.module.css';

const Phone = ({ onNext }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    
    // Creating dispatcher which we have imported above from react-redux
    const dispatch = useDispatch();
    
    async function submit() {
        // Before calling the onNext we need to make and complete the server request
        // To make a server request we need to use axios or JS inbuilt Fetch API
        const { data } = await sendOtp({ phone: phoneNumber }); // receiving the data from the server
        console.log(data);
        // Using the dispatcher to dispatch the data from one page to another
        dispatch(
            setOtp({ // setOtp is the action that we have imported from authSlice.js inside the reducers. We are calling that action and passing the data from here to the store where we will be storing the data inside setOtp.
                phone: data.phone, // passing the data to setOtp inside authSlice.js. These data will be available to us inside action.payload payload has the data
                hash: data.hash
            })
        );
        onNext();
    }
 
    return (
        <Card title="Enter your phone number" icon="phone">
            <TextInput value={phoneNumber} onChange = {(e) => setPhoneNumber(e.target.value)}/> {/*setPhoneNumber will set the changes in phone number in the input field */}
            <div>
                <div className={styles.actionButtonWrap}>
                    <Button text="Next" onClick={ submit }/> {/* When we click on the onNext button we will be redirected to our OTP page. For that first we need to make a server request and after we receive the response then we need to call the onNext Button */}
                </div>
                <p className={styles.bottomParagraph}>By entringing your number, you're agreeing to our Terms of service and Privacy Policy. Thanks!</p>
            </div>
        </Card>
    );
}

export default Phone
