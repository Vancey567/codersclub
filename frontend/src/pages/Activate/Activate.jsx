import React, { useState } from 'react'
import StepName from '../Steps/StepName/StepName' // Since the folder name is same with component name so we will have to write the StepName again
import StepAvatar from '../Steps/StepAvatar/StepAvatar'

const steps = {
    1: StepName,
    2: StepAvatar
}

const Activate = () => {
    const [step, SetStep] = useState(1);
    const Step = steps[step]; // get the component from the steps object
    
    function onNext() {
        SetStep(step + 1);
    }
    
    return (
        <div className="cardWrapper"> 
            <Step onNext={onNext}></Step>
        </div>
    )
}

export default Activate
