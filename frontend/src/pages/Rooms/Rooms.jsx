import React, { useState, useEffect } from 'react'
import RoomCard from '../../components/RoomCard/RoomCard'
import AddRoomModal from '../../components/AddRoomModal/AddRoomModal'
import styles from './Rooms.module.css'
import { getAllRooms } from '../../http/index'

// const rooms = [
//     {
//         id: 1,
//         topic: "abcsdhkewioyhoih !",
//         speakers: [
//             {
//                 id: 1,
//                 name: "jon doe",
//                 avatar: '/images/monkey-avatar.png',
//             },
//             {
//                 id: 2,
//                 name: "jon doe",
//                 avatar: '/images/monkey-avatar.png',
//             },
//         ],
//         totalPeople: 40,
//     },
//     {
//         id: 2,
//         topic: "Science !!",
//         speakers: [
//             {
//                 id: 1,
//                 name: "jon doe",
//                 avatar: '/images/monkey-avatar.png',
//             },
//             {
//                 id: 2,
//                 name: "jon doe",
//                 avatar: '/images/monkey-avatar.png',
//             },
//         ],
//         totalPeople: 37,
//     },
// ]

const Rooms = () => {
    const [showModal, setShowModal] = useState(false);
    const [rooms, setRooms] = useState([]);

    // Using useEffect we will call the server
    useEffect(() => {
        const fetchRooms = async () => { // create a function
            const { data } = await getAllRooms(); // fectch the data from the server
            setRooms(data); // pass the data inside setRooms state 
        };
        fetchRooms(); // on load of the page this function gets called and it will fetch the data of our rooms list
    }, []); // empty [] indicates that it will run only once on the page load. 

    function openModal() {
        setShowModal(true)
    }
    return (
        <>
           <div className="container">
               <div className={styles.roomsHeader}>
                   <div className={styles.left}>
                        <span className={styles.heading}>All voice rooms</span>
                        <div className={styles.searchBox}>
                            <img src="/images/search-icon.png" alt="search" />
                            <input type="text" className={styles.searchInput} />
                        </div>
                   </div>
                   <div className={styles.right}>
                        <button onClick={openModal} className={styles.startRoomButton}>
                            <img src="/images/add-room-icon.png" alt="add-room" />
                            <span>Start a room</span>
                        </button>
                   </div>
               </div>

               {/* Room List */}
                <div className={styles.roomList}>
                    { 
                        rooms.map((room) => ( 
                            <RoomCard key={room.id} room={room}/>
                        ))
                    }
                </div>
           </div>
           { showModal && <AddRoomModal onClose={() => setShowModal(false)}/>}
           
        </>
    )
}
// Checking
export default Rooms
