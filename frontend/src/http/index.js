// We need to create a instance using which we will do our interceptors work.
// All endpoints in our application will be kept here and then we will export it from here.This will bundle all the endpoints at one point here and in furture we can change it here
// We will import this file in our component and use it then 

import axios from 'axios';

// Create an instance of axios object.
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // http://localhost:5500/api/send-otp
    headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',// What type of data we can accept
    },
})

// List of all the endpoints
export const sendOtp = (data) => api.post('/api/send-otp', data); // Since it a post method then we need to pass some data as well which we will receive it here when we call this endpoint from the component wwe will pass it from there
export const verifyOtp = (data) => api.post('/api/verify-otp', data); // Take the data and verify the otp


export default api;