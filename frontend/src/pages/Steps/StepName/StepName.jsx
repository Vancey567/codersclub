import React, { useState } from 'react'
import Card from '../../../components/shared/Card/Card'
import Button from '../../../components/shared/Button/Button'
import TextInput from '../../../components/shared/TextInput/TextInput'
import { useDispatch, useSelector } from 'react-redux'
import { setName } from '../../../store/activateSlice'

import styles from './StepName.module.css'

const StepName = ({onNext}) => {
    const { name } = useSelector((state) => state.activate); // We will get the name of the user from the store. We need it because when we reverte back from the Avatar page to Activate page we don't want the name of the user stored inside the input field to set to '' empty string. So we will fetch the name from the store and store it as the default state name. 

    const dispatch = useDispatch();
    const [fullname, setFullName] = useState(name); // This will set the name of the user from store to the input field even when we revert back from the Avatar page to Activate page

    function nextStep() {
        if(!fullname) {
            return;
        }

        dispatch(setName(fullname)); // If the user has give some name then we will dispatch it to the store and store it there.
        onNext();
    }

    return (
        <>
            <Card title="What's your full fullname?" icon="goggle-emoji">
                    <TextInput value={fullname} onChange={(e) => setFullName(e.target.value)}/>
                    <p className={styles.paragraph}>
                        People use real names at codersclub
                    </p>
                    <div className={styles.actionButtonWrap}>
                        <Button onClick={nextStep} text="Next" />
                    </div>
            </Card>
        </>
    )
}

export default StepName
