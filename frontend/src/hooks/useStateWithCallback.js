import { useState, useCallback, useRef, useEffect } from 'react';

export const useStateWithCallback = (initialState) => {
    const [state, setState] = useState(initialState);
    const cbRef = useRef(); // we use useRef() hook so that the element/thing which is stored inside cbRef gets stored in it on each render. i.e if the value inside cbRef changes then also the component will not re-render , while is some changes occure in useState() then component re-renders.
    
    const updateState = useCallback((newState, cb) => { // cb is callBack, We use callback hook here so that the function inside it will not get created again again on each render, this will increase the performance.
        cbRef.current = cb; // we are storing the callback inside a reference 
        
        // setState((prev) => {[...prev, newState]}) // This is the recommeded way to update the state.
        setState((prev) => { // Update the local state, we get the previous state inside setState. This is how we set state in react. setClient((prev) => {[...prevState, newState]})
            return typeof newState === 'function' ? newState(prev) : newState; // we are checking if function is passed then call the function and give the previous state inside it, else if someone is normally updating the state then update the value inside local state ass newState.
        })
    });

    // We will call the callback inside here and it will get Triggered when state updates.
    useEffect(() => {
        if(cbRef.current) { // by default cbRef is not a function so we will have to have a check here.
            cbRef.current(state); // since we have stored the function inside cbRef, we will pass the updateState here
            cbRef.current = null; // after that we will make the cbRef as null
        }
    }, [state]); // jab ye state update hojata hai tab ye useEffect call hoga

    return [state, updateState];
};

// updateState() is the setState function from useWebRTC. since we are passing the state and updateState like [state, setState]