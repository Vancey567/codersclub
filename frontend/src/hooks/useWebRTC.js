import { useState, useRef, useCallback, useEffect } from 'react';
import { useStateWithCallback } from './useStateWithCallback'
import { socketInit } from '../socket/index';
import { ACTIONS } from '../actions';
import freeice from 'freeice';
// import { set } from 'mongoose';

const useWebRTC = (roomId, user) => {
    // We have list of all the users
    const [clients, setClients] = useStateWithCallback([]);// useStateWithCallback() is our custom hook, it will work like useState only. The only difference is that we will make our setClients() in such a way that its a callback function. After setting/updating the client our callback will get executed.

    const audioElements = useRef({
        // userId: instance, // It will contain the userId of that user and its value will be the instance of it's audio element. So that we will know which user id has which audio player hai.
    }); // We will store a refrence // We need to maintain a list of audio elements, and we will need to maintain the map of it as well i.e. which user's audio elements is it. So that if we want to mute a particular user than we should know which audio elements belongs to which user to mute. 
    const connections = useRef({}); // to store all the peer connections we will need a connection refrence.
    const localMediaStream = useRef(null);    // We need local media stream. When we will get connected we will have a local stream. 
    const socket = useRef(null);
    const clientsRef = useRef([]);

    const provideRef = (instance, userId) => {
        audioElements.current[userId] = instance; // since it is a useRef we will get the value inside the current only. Since in useRef we have assigned it with an object so we will store the key userId dyanmically  so we used "[]" and value as instance of audio 
    }

    // This useEffect will be called when the page loads for that we give [] "empty dependency array"
    useEffect(() => {
        socket.current = socketInit(); // the object returned will be initialized in the socketInit(); 
    }, []);

    // Before adding a new user to the client list. we internally need to have some checks for that we will not directly use setClient but instead we will have a wrapper function to do it. 
    // Here we will retrun the same function but inside it we will apply some extra checks.
    // check are check if newClient is already exists in the list, if it doesn't then add that newClient to the client list
    const addNewClient = useCallback( // we will use useCallback() cuz we don't need to create it on every render.
        (newClient, cb) => { // cb is callback function
            // what we will check here is inside our clients list, jo current client hai jo hum add karna chahte hai wo pahle se hai to nahi. Agar nahi hai to use hum phirse add nahi karenge.
            const lookingFor = clients.find((client) => client.id === newClient.id);
            if (lookingFor === undefined) {
                setClients((existingClients) => [...existingClients, newClient], cb); // existingClient me new client add kardo aur return kardo. And since we have made this inside a custom Hook so we will have a secondary callback parameter.
            }
        },
        [clients, setClients], // dependency, jab hi clients and setClients change ho jata hai tab hi, we will create it new else we will not create a new
    )

    // *** Start Capturing audio from computer mic ***
    useEffect(() => {
        const startCapture = async () => {
            localMediaStream.current = await navigator.mediaDevices.getUserMedia({ // Our bowser has a navigator object which is available directly onn window object. We will store it in localMediaStream and it is a useRef so we will store it in current.
                audio: true // here we will pass which all media do we need
            });
        }

        startCapture() // we  need to call this startCapture() so that it starts capturing the audio and since its a async function it returns a promise on which we will have .then()
            .then(() => { // As soon as the audio is captured we need to add the current user in the array/list of client. For that create a 
                addNewClient({...user, muted: true}, () => { // add current user to the clients list and after adding it we wanted to do someting so we made a callback do that task. 
                    const localElement = audioElements.current[user.id];
                    if (localElement) {
                        localElement.volume = 0; // if you don't do the volume 0 you will here your voice echo
                        localElement.srcObject = localMediaStream.current; // and uss localElement me kya play karna hai uska source dedo. We will play the local media that we are getting
                    }

                    // how to add 2nd/other clients.

                    // Now we need to send this audio to the server using webSockets.
                    // We will send the data/offer to the 2nd client.
                    // Socket emits JOIN using socket.io, we want ourself to join with the webSockets.
                    socket.current.emit(ACTIONS.JOIN, { roomId, user }); // as soon as the page is loads it will emit a join event and will try to connect
                });
            });

            // Cleaning function
            return () => { // jab hum page ko leave karenge then we need to stop the track.
                localMediaStream.current
                    .getTracks()
                    .forEach(track => track.stop()); // apne track/stream ko stop karenge
                
                socket.current.emit(ACTIONS.LEAVE, { roomId }); // event emit karenge leave
            }
    }, [])

    // 
    useEffect(() => {
        const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => { // remoteUser is the alias for user, peerId is the socketId coming from the server.
            // We need some data from the server to handle peer.
            // createOffer will be true or false, The one who wants to connect will create the offer not the one who is getting connected.
            // Here to add peer we will need to check if the connection already consists of the peer that wanna get added?
            // If already connected then give warning
            if (peerId in connections.current) {
                return console.warn(`You are already connected with ${peerId} (${user.name})`)
            }

            // If the user is not inside connections obejct, then we will create a webRTC connection object of the current client and store it inside the connections.
            connections.current[peerId] = new RTCPeerConnection({ // key = peerId i.e. socketId and value is the new RTCPeerConnection Object that we created in webRTC
                iceServers: freeice(), // iceServers tells your machine what is your public IP as your machine doen't know it's public IP, We call the freeice() which will give my machine public ip
            });

            // Handle new ice candidate
            connections.current[peerId].oniceCandidate = (event) => {
                socket.current.emit(ACTIONS.RELAY_ICE, {
                    // With icecandidate we need to send the data with it
                    peerId, // peerId is that to whome we want to send this icecandidate, which we will get inside the event handlePeer
                    icecandidate: event.candidate
                })
            }

            // Handle ontrack on this connection, as soon as data/stream comes we need to handle it. So we will put a eventListners for it
            connections.current[peerId].ontack = ({ streams: [remoteStream] }) => {// we get the streams of the other client in the form of Array and we want the remoteStream property from it. This is the function Parameter that we have destructured.
                // we need to add the new peer inside the clients state so that it gets rendered and is visible to us i the browser.
                addNewClient(remoteUser, () => { // after the clients gets updated this callback gets called.
                    if (audioElements.current[remoteUser.id]) { // if the audioPlayer is already created for this user?
                        audioElements.current[remoteUser.id].srcObject = remoteStream; // then add the remoteStream that we are getting to the srcObject
                    } else { // player(audioElement) is not rendered in the UI, so we will employee a setInterval which will rerun every second to check if the audioElement is rendered and if it is then we will add the remoteStream to the srcObject and once the remoteStream is attached then clear the interval.
                        let settled = false; // acting as flag
                        const interval = setInterval(() => { // it will check if the audioStream exists every 1 sec, if exist then connect this remote stream
                            if (audioElements.current[remoteUser.id]) { // if the audioPlayer is already created for this user?
                                audioElements.current[remoteUser.id].srcObject = remoteStream;
                                settled = true;
                            }

                            if (settled) {
                                clearInterval(interval);
                            }
                        }, 1000);
                    }
                });
            };

            // *** Add Local track to remote connections ***   We need to add all the local media stream(track) to this connection. So that our voice goes to the all other client.
            localMediaStream.current.getTracks().forEach((track) => {
                connections.current[peerId].addTrack(track, localMediaStream.current) // which track to connect and in that track what mediaStream should be attached to that track. 
            })

            // Create Offer
            if (createOffer) { // if createOffer = true then we need to create offer 
                const offer = await connections.current[peerId].createOffer();

                await connections.current[peerId].setLocalDescription(offer);

                // Send offer to another clients by sending offer first to the server then server will send the offer to other client. (Server is the medium to send the offer to another client)
                socket.current.emit(ACTIONS.RELAY_SDP, { // SDP is session Description
                    peerId, // which peer we want to send the offer to
                    sessionDescription: offer // the offer we want to send
                })
            }
        };

        socket.current.on(ACTIONS.ADD_PEER, handleNewPeer)

        return () => {
            socket.current.off(ACTIONS.ADD_PEER);
        }
    }, [])

    // *** Handle Ice Candidate *** we use relay to send from client to server 
    useEffect(() => {
        socket.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, iceCandidate }) => {
            if (iceCandidate) {
                connections.current[peerId].addIceCandidate(iceCandidate);
            }
        })

        // Cleaning function
        return () => {
            socket.current.off(ACTIONS.ICE_CANDIDATE); // unsubscribe if you are leaving the socket
        }
    }, [])

    // *** Handle SDP *** sending from server to client.
    useEffect(() => {
        const handleRemoteSdp = async ({ peerId, sessionDescription: remoteSessionDescription }) => {
            // Get connection 
            connections.current[peerId].setRemoteDescription(new RTCSessionDescription(remoteSessionDescription));

            // If session description is type of offer then create/give an answer.
            if (remoteSessionDescription.type === 'offer') {
                const connection = connections.current[peerId];
                const answer = await connection.createAnswer();

                connection.setLocalDescription(answer); // since we have created the answer, so we need to add the answer to the local description.

                socket.current.emit(ACTIONS.SESSION_DESCRIPTION, {
                    peerId,
                    sessionDescription: answer,
                })  
            }
        }

        socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp);

        return () => {
            socket.current.off(ACTIONS.SESSION_DESCRIPTION);
        }
    }, [])

    // *** Handle Remove Peer ***
    useEffect(() => {
        const handleRemovePeer = async ({ peerId, userId }) => {
            if (connections.current.peerId) {
                connections.current[peerId].close(); // close the webRTC connection
            }

            delete connections.current[peerId]; // deleting exsiting connection from the object
            delete audioElements.current[peerId];
            setClients((list) => list.filter((client) => client.id) !== userId) // client ki list se v iss client ko nikal do
        }

        socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

        // Cleaning
        return () => {
            socket.current.off(ACTIONS.REMOVE_PEER);
        }
    }, [])


    // Handling Mute
    const handleMute = (isMute, userId) => {
        let settled = false;

        let interval = setInterval(() => {
            if (localMediaStream.current) {// local media stream agar ready hoga tab hi mute unmute karo
                localMediaStream.current.getTracks()[0].enabled = !isMute; // Mute the first element of local media stream array. This has a property named "enabled". If we make it false, then our stream will still be playing but it will not forward the packets. It will forward the empty frames. So our voice will not go ahead. If the isMute is true i.e. user is not muted then mute it.
                if (isMute) {// if the user is muted then send this data to other users as well using webSocket so that other user changes it's UI accordincgly 
                    socket.current.emit(ACTIONS.MUTE, {
                        roomId,
                        userId: user.id,
                    });
                } else {
                    socket.current.emit(ACTIONS.UNMUTE, {
                        roomId,
                        userId: user.id,
                    });
                }
                settled = true;
            }

            if(settled) {
                clearInterval(interval);
            }
        }, 200);
    }

    useEffect(() => {
        clientsRef.current = clients;
    }, [clients]);

    //Listen for mute/Unmute
    useEffect(() => {
        const setMute = (mute, userId) => {
            console.log('Mute/unmute', mute)
            const clientIdx = clientsRef.current.map(client => client.id).indexOf(userId); // converting objects array into ids array and then finding idx of user
            console.log(clientIdx);
            
            const connectedClients = JSON.parse(JSON.stringify(clientsRef.current)); // COPY HACK
            if(clientIdx > -1) {
                connectedClients[clientIdx].muted = mute;
                setClients(connectedClients);
            }
        }

        socket.current.on(ACTIONS.UNMUTE, ({peerId, userId}) => {
            setMute(false, userId);
        })

        socket.current.on(ACTIONS.MUTE, ({peerId, userId}) => {
            setMute(true, userId);
        })
    }, [])

    return { clients, provideRef, handleMute }; // we have returned client object so that we can extract the client data from inside it.
};

export default useWebRTC;

// Our gole was to "get a callback" as soon as our client updates using setClients. But hooks don't have this callback feature so we created a custom hook
// useStateWithCallBack(), it is like normal useState only but with callback. i.e when you will call setClients() then you will get a next parameter as the
// callback function inside which we will run it.

// setClients((prev) => {}, (state) => { // we get the callback function here because of our custom hook
//     // after state update
// })