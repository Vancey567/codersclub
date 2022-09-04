// We need to create a instance using which we will do our interceptors work.
// All endpoints in our application will be kept here and then we will export it from here.
// This will bundle all the endpoints at one point here and in future we can change it here
// We will import this file in our component and use it then 

import axios from 'axios';

// Create an instance of axios object.
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // http://localhost:5500/api/send-otp
    withCredentials: true, // We enable this when we want to save cookie or we want to send cookiee with request. If this is false then it will not send the cookie on client and won't be able to save the cookie on the client. This will enable us to see cookie to store our accessToken and refresh token
    headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',// What type of data we can accept
    },
})

// List of all the endpoints
export const sendOtp = (data) => api.post('/api/send-otp', data); // Since it a post method then we need to pass some data as well which we will receive it here when we call this endpoint from the component we will pass it from there
export const verifyOtp = (data) => api.post('/api/verify-otp', data); // Take the data and verify the otp
export const activate = (data) => api.post('/api/activate', data); // once the user has given it's name and the profile image, upload those on the server using this url
export const logout = () => api.post('/api/logout'); // 
export const createRoom = (data) => api.post('/api/rooms', data); // create a room
export const getAllRooms = () => api.get('/api/rooms'); // create a room
export const getRoom = (roomId) => api.get(`/api/rooms/${roomId}`); 



// Interceptors: It intercepts, It sits between every req, res on our frontend. So we can check every req, res that comes/goes on our frontend. 
// But here we only want to check the response, cuz if the response we get as 401 that means the accessToken has expired and we need to refresh it again.
api.interceptors.response.use(// It you want to add something in the response header user interceptors.response.use then call the use by passing the two callback function 1st gives the config(Whole info about our req/res which ever is chained) and the 2nd err
    (config) => {
        return config;
    },
    
    async (error) => {
        console.log(error);
        // We will store the original request in a variable, cuz another req will also go from here. So the first error that we want to repeat after the the token is refreshed shouldn't be harmed.
        const originalRequest = error.config; // Storing original request
        if(error.response.status === 401 && originalRequest && !originalRequest._isRetry) { // check if the error reponse status is 401 or not, error has config object or not, and config has attach isRetry. with isReTry we are checking if after 1 request the server again reponds with 401 that means our refreshToken has also expired and it will keep on getting the same status code again and again leading to infinite loop.
            originalRequest.isRetry = true; // config._isRetry will be undefined first and then when we will come inside we will make the isRetry as true so when it go gain cheking the _isRetry become false(as the value is true) so we won't stuck in the loop.
            try {
                await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/refresh`, // We are calling the refresh end and with that we are sending the cookie to the server.
                    { 
                        withCredentials: true, // so that we are able to send cookie. It(cookie) will go on server and will check if the refresh token is valid. It will generate the refresh token and will store it in new token in DB. And again we will store the refresh and access Token in cookies.
                    }
                );
                
                // After the above request is complete then we have the new tokens in the cookie
                return api.request(originalRequest); // Then we will again make the request, The previous request that we wanted to call earlier that request will be performed again.

            } catch(err) {
                console.log(err.message);
            }
        }        
        throw error;
    } 
);

export default api;