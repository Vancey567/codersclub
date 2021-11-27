import React, { useState} from 'react'
import styles from './Register.module.css';

import StepPhoneEmail from '../Steps/StepPhoneEmail/StepPhoneEmail';
import StepOtp from '../Steps/StepOtp/StepOtp';
import StepName from '../Steps/StepName/StepName';
import StepAvatar from '../Steps/StepAvatar/StepAvatar';
import StepUsername from '../Steps/StepUsername/StepUsername';

// Creating hashmap to bring the steps in a sequencial manner after registration
// We Mapped when the step is 1 show StepPhoneEmail component, when step = 2 show StepOtp and so on
const steps = { 
    1: StepPhoneEmail,
    2: StepOtp,
    3: StepName,
    4: StepAvatar,
    5: StepUsername
};

const Register = () => {
    // Making the steps dynamic by creating a local state.By default StepPhoneEmail will the first step when register component opens
    const [step, setStep] = useState(1); // by default in step variable the value will be 1  
    const Step = steps[step]; // in Capital Step the components will be assigned and will changing a/c to the value in the step from use state

    function onNext() {
        setStep(step + 1); // Jo v current step hai usme 1 add karo
    }

    return (
        <div>
            <Step onNext={onNext}/>{/* Step is a dynamically chnaging component which we are getting from above here inside Step we will be having different component based on the key:1,2,3, of steps*/}
        </div>
    )
}

export default Register
