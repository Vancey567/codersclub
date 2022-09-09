require('dotenv').config(); // This will bring the credentials here in our application
const express = require('express');
const app = express();
const router = require('./routes');// This will import the router and it will go inside the router.js file and check/execute the endpoints there.
const DbConnect = require('./database');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 5500; // Earlier it was 3000 in cors corsOptions also
const ACTIONS = require('./actions');
// We will create a node server and we will pass the express server(app) into it so that express also runs/works on this server.
// and now we will instead of doing app.listen() we will do server.listen()
const server = require('http').createServer(app);

const io = require('socket.io')(server, {
    cors: { 
        origin: 'https://localhost/3000',
        methods: ['GET', 'POST'],
    }
});

app.use(cookieParser()); // This should be called first on top of all other.

DbConnect(); // We will call the dbConnect and our database will be connected;

const corsOptions = {
    origin: ['http://localhost:3000'], // Pass the server url(client in this case) from where you are making a request
    credentials:true,            
    optionSuccessStatus:200,
}

app.use(cors(corsOptions));

//Controls the maximum request body size. If this is a number, then the value specifies the number of bytes; if it is a string, the value is passed to the bytes library for parsing. Defaults to '100kb
app.use(express.json({limit: '8mb'})); // To read the json data. By default the express limit to send the request to the server is 100kb. But here in our applicationn we are sending the user profile image in the request so we will get the 401 error: Payload to large in request. So we need to increase the limit. Here 8mb.
app.use(router);

// This will make our static server as live server so if you paste the img url in our browser we will get the image to see
app.use('/storage', express.static('storage')); // first storage tells us that any url that starts with storage then from the given folder take serve the assets. Second storage is the folder name.


// *** Socket Logic ***
// Which socket id is connected to which user for that we will create a socketMapping
const socketMapping = {}

io.on('connection', (socket) => { // we will get info about current socket that has get connected in to "socket"
    // console.log('new Connenction', socket.id);
    // Here we will reeceive the data object inside here, where we will have the roomeId which room to join and other is user
    socket.on(ACTIONS.JOIN, ({roomId, user}) => { // If the join event get emmited then what we will do for that we will give a callback. From frontend we are emitting join event on the socket and here we are listening it on backend.
        socketMapping[socket.id] = user; // If someone Wants to join then on the socketMapping we will put the current socketId as key and we will put the value of which ever user is trying to join.
        
        // Map, Get all the client that are coonected in the room at this moment.
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []) // this is a map provided by socket itself on which we have a get method. So pass the roomId to it. It the room is created then give that room else give a empty array "for the first time". We need to convert the map in to clean array so we did Array.from()
        
        // If the room is already created then get all the user inside that room and display it 
        clients.forEach((clientId) => { // We are telling every clients that I want to connect, so I will create the offer. we will get the clientId i.e. socketId of Each client
            // We need to emit a event to everyUser to add me inside the room
            io.to(clientId).emit(ACTIONS.ADD_PEER, {
                peerId: socket.id, // we are telling other clients that this is my socketId
                createOffer: false, // we are telling other that you don't need to create the offer I will create the offer.
                user // Add me(user)
            });

            // Since I'm not inside the room so I will not receive the event emmited by me
            // So emit a event to add yourself to the room.
            socket.emit(ACTIONS.ADD_PEER, {
                peerId: clientId, // who all are going to connect we will send there id on each iteration
                createOffer: true, // telling other to create there offers
                user: socketMapping[clientId] // we are sending this to all the users in the room from socketUserMapping using clientId. 
            });
        });

        socket.join(roomId); // Now we will join this room
    });

    // *** Handle relay Ice ***
    socket.on(ACTIONS.RELAY_ICE, ({peerId, iceCandidate}) => {
        io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {// we will forward the peer id to the next client. on the passed peerId we will emit the Action. That we are giving. We have only this RELAY_ICE candidate. That is beeing shared to go from one client to server and server to the other client. 
            peerId: socket.id, // we will pass which peer want to connect.
            iceCandidate // and also send the iceCandidate to the next client
        }); 
    })

    // *** Handle relay sdp ***
    socket.on(ACTIONS.RELAY_SDP, ({peerId, sessionDescription}) => {
        io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {// we will forward the peer id to the next client. on the passed peerId we will emit the Action. That we are giving. We have only this RELAY_ICE candidate. That is beeing shared to go from one client to server and server to the other client. 
            peerId: socket.id, // we will pass which peer want to connect with you. Which peer's session description is this.
            sessionDescription // and also send the iceCandidate to the next client
        }); 
    });

    // Handle Mute/unmute
    socket.on(ACTIONS.MUTE, ({roomId, userId}) => {
         const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []); // get all the cleints connected in the room
        
         clients.forEach(clientId => { // emit event to each client telling them the user has muted itself
            io.to(clientId).emit(ACTIONS.MUTE, {
                peerId: socket.id, 
                userId,
            })
         })
    });

    socket.on(ACTIONS.UNMUTE, ({roomId, userId}) => {
         const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []); // get all the cleints connected in the room
        
         clients.forEach(clientId => { // emit event to each client telling them the user has muted itself
            io.to(clientId).emit(ACTIONS.UNMUTE, {
                peerId: socket.id, 
                userId,
            })
         })
    });

    socket.on(ACTIONS.MUTE_INFO, ({ userId, roomId, isMute }) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach((clientId) => {
            if (clientId !== socket.id) {
                console.log('mute info');
                io.to(clientId).emit(ACTIONS.MUTE_INFO, {
                    userId,
                    isMute,
                });
            }
        });
    });

    // *** Handle Leaving the room ***
    const leaveRoom = () => { // jab v user leave karega to jitne v room me user hai sabse use leave kar denge
        // Jab v page leave karenge tab hame
        const {rooms} = socket; // get all the rooms

        // rooms that we got is a map. so we need to convert it in array using Array.from(rooms)
        Array.from(rooms).forEach((roomId) => { // we will get the id of each room
            const clients = Array.from(
                io.sockets.adapter.rooms.get(roomId) || []
            ); // get all the clients, agar rooms nahi hai to empty array return kardo

            // sare cleints pe loop lagao, aur wo bolega har ek client se mujhe nikalo
            clients.forEach((clientId) => { 
                io.to(clientId).emit(ACTIONS.REMOVE_PEER, { // inn clients ko bhej dia ki mujhe nikal do. lekin utni hi baar REMOVE_PEER trigger karna parega so that inn clients ko apne client se nikal du
                    peerId: socket.id, // send the data
                    userId: socketMapping[socket.id]?.id,
                });

                // remove yourself as well your clients as well
                // socket.emit(ACTIONS.REMOVE_PEER, {
                //     peerId: clientId,
                //     userId: socketMapping[clientId]?.id,
                // });
            });
            socket.leave(roomId)
        });
        delete socketMapping[socket.id];
    };
    socket.on(ACTIONS.LEAVE, leaveRoom);
    socket.on('disconnecting', leaveRoom); // disconnecting is a web socket event which should be disconnecting only. if we write disconnect then it will be triggered only when we disconnect but disconnecting will get triggered before disconnecting. Like if we close the browser.
});

server.listen(PORT, (req, res) => {
    console.log(`Listning on PORT ${PORT}`);
})