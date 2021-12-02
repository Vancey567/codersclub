import React, { useState } from 'react'
import Card from '../../../components/shared/Card/Card'
import Button from '../../../components/shared/Button/Button'
import TextInput from '../../../components/shared/TextInput/TextInput'
import { verifyOtp } from '../../../http';
import { useSelector } from 'react-redux'; // useSelector hook is used to fetch the data from the Store
import { setAuth } from '../../../store/authSlice'
import { useDispatch } from 'react-redux'; // useDispatch hook is used to set the state in a slice

import styles from './StepOtp.module.css';
// import styles from '../../../App.module.css';

const StepOtp = () => { // removed from function: { onNext }
    const [otp, setOtp] = useState('');

    const dispatch = useDispatch();
    // call the hook where we get a callback function inside we need to specify which state we want to use from the store. 
    // If you write only state inside the callback function it will give us the entire state. But if you want to use a single slice then you will need to specify the name of the slice.
    // const dataFromStore = useSelector((state) => state.auth); // We only need the entire auth slice not the entire state will all the slice. dataFromStore has the entire auth slice
    const { phone, hash } = useSelector((state) => state.auth.otp); // We only need the entire auth slice not the entire state will all the slice. dataFromStore has the entire auth slice
    
    async function submit() {
        // We need to make a request from here to send the OTP + HASH to the server. to verify Our OTP. Whose route we have created in our backend "verify-otp"
        // Since this is a server request then it's a good practice to keep the code inside try catch block and handle the errors that can possibly occur
        // if (!otp || !phone || !hash) return;
        try {
            // We will be passing the otp which is stored in our local state, phone and hash which are stored in our "Store". 
            // We need to fetch our store here that we have created using redux-toolkit. To fetch the "store" here we need to import a hook named useSelector which is inside react-redux.
            const { data } = await verifyOtp({otp, phone, hash }); // This will return our tokens which we will store in data variable by destrcturing it. 
            console.log(data)
            dispatch(setAuth(data));
            // onNext()
        } catch (err) {
            console.log(err);
        }
    } 
    // submit()

    return (
        <>
            <div className={styles.cardWrapper}>
                <Card title="Enter the code we just texted you" icon="lock-emoji">
                    <TextInput value={otp} onChange={(e) => setOtp(e.target.value)}/>
                    <div className={styles.actionButtonWrap}>
                        <Button onClick={submit} text="Next" />
                    </div>
                    <p className={styles.bottomParagraph}>
                        By entering your number, you're agreeing to our Terms of service and Privacy Policy. Thanks!
                    </p>
                </Card>
            </div>
        </>
    )
}

export default StepOtp
