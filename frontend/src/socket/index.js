import { io } from 'socket.io-client';


export const socketInit = () => {
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000, // if the connection is not established within this time period then it will do a connecction timeout.
        transports: ['websocket'],
    };
    return io('http://localhost:5500', options); // it will initialize the io and return 
}