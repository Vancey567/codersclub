import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAuth } from '../store/authSlice';

export function useLoadingWithRefresh() {
    const [ loading,  setLoading ] = useState(true);
    const dispatch = useDispatch();
    
    useEffect(() => { // Any work should be done inside useEffect(); 
        (async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/refresh`, { withCredentials: true }); // generate and get the new tokens. we will send the cookie as well and it will get the response in return. Inside reponse we have data so we will get the data from res.data by destructuring it in data. 
                dispatch(setAuth(data)); // the data we will receive will be stored in the store inside setAuth inside which we have teh isAuth property which will be marked true. And the data will have the user data as well send from auth-controller.js as response.
                setLoading(false); // Since we have received the data set the loading as false. 
                // console.log(data);
            } catch (err) {
                console.log(err);
                setLoading(false); // even if we have the error then also we need to remove the loading sign from screen.
            }
        })();
    }, []);
    // })

    return { loading }; // We need to return something (object here) from the hook. Here "loading" is the variable and when this hook variable will get called it will
}

// We can use custom hooks inside react hooks.
// We will keep the above dependency array as empty so that the aninymous function gets called only once.
// Inside we will be able todo the server request for that we need to use await. And for it we can create a anonymous funcion(IIF) with async
// 

// we will pass the data coming from the server inside setAuth.(authSlice.js)
// we will get the data inside payload there and we will extract the user from it and assign it to the initial state(update state) and will make the isAuth true. and because of it we will get logged In.