import { createSlice } from '@reduxjs/toolkit';// createSlice is function inside @reduxjs/toolkit

const initialState = {
  name: '',
  avatar: ''
};

export const activateSlice = createSlice({
  name: 'activate', 
  initialState,
  reducers: { // reducers are pure functions which are used to change state because we can't directly change above state.
    // These are actions
    setName: (state, action) => {
      state.name = action.payload; // we will send only the name inside the payload
    },

    setAvatar: (state, action) => {
      state.avatar = action.payload;
    }
  },
})

export const { setName, setAvatar } = activateSlice.actions

export default activateSlice.reducer

