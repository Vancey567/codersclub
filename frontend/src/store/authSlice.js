
import { createSlice } from '@reduxjs/toolkit'// createSlice is function inside @reduxjs/toolkit

const initialState = { // By default what is the state.
  isAuth: false, // By default the user is not authenticated/loggedIn 
  user: null, // We don't have user till now before login
  otp: {
    phone: '',
    hash: ''
  }
};

export const authSlice = createSlice({
  name: 'auth', // This is the name of the slice
  initialState, // It takes the initial State of the 
  reducers: { // reducers are pure functions which are used to change state because we can't directly change above state.
    // These are actions
    setAuth: (state, action) => { // setAuth is a type of Action or function. Redux toolkit have kindda combined the action of redux and function and created this. It takes the state and action as parameter, where action has the data to be updated. 
      // We need to call this setAUth so that we can pass the data here. And write some logic here and update/store the data in the intialState(above) somehow
      // To so that we use some hooks of react
      const { user } = action.payload;
      state.user = user;
      if(user === null) { // no user set authenticated as false
        state.isAuth = false;
      } else { // if there exist a user then set authenticated as true 
        state.isAuth = true;
      }
    },

    // Another action
    setOtp: (state, action) => {
      const { phone, hash } = action.payload; // payload has the data that is being passed from the dispatch sendOtp section of phone.jsx. We are destructuring it and storing it inside phone, hash.
      // console.log(`athSlice Phone: ${phone}, hash: ${hash}`);
      // Setting the data we received in payload to the initial state.
      state.otp.phone = phone; // state has the initial state.
      state.otp.hash = hash;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setAuth, setOtp } = authSlice.actions // We need to export the action or reducer from here

export default authSlice.reducer // Export the reducer slice


// Redux Toolkit allows us to write "mutating" logic in reducers. It
// doesn't actually mutate the state because it uses the Immer library,
// which detects changes to a "draft state" and produces a brand new
// immutable state based off those changes


// Inside reducers of redux, If we wanted to change the state the we used to copy the "state of the reducers" for that we used to store the value inside that state and then we used to create a new object and then we used to store/keep that inside the "store"
// But in redux-toolkit it is simplified. We don't need to copy the state. We can directly change the state. Internally redux-toolkit will do the copy of the thing.


// Redux Toolkit create a global state so our data will be saved in a global state and we will be able to get that state data even if the page changes. 
// Until we refresh the page the data inside the global state will persist there. 