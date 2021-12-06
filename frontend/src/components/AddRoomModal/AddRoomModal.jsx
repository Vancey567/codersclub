import React, { useState } from 'react';
import styles from './AddRoomModal.module.css';
import TextInput from '../shared/TextInput/TextInput';
import { createRoom as create } from '../../http'; // as give a alias name for createRoom as create. Or it will have a name conflict with the function named createRoom as well 
import { useHistory } from 'react-router-dom'

const AddRoomModal = ({ onClose }) => {
    const history = useHistory();

    const [roomType, setRoomType] = useState('open'); // selcect room type
    const [topic, setTopic] = useState(''); // Write the topic to be discussed

    async function createRoom() {
        // Server call
        try {
            if(!topic) return; // If someone clicks on the topic button even if they have not written a topic then a empty string will go onto the server. But this will avoid it to do so
            const { data } = await create({ topic, roomType });
            history.push(`/room/${data.id}`);// We will redirect to single room page using the single useHistory hook. Inside it we will push our new url for the new room using the rooms uniqe id. But before redirecting we need to register this route in our app.js
        } catch (err) {
            console.log(err.message);
        }
    }


    return (
        <div className={styles.modalMask}>
            <div className={styles.modalBody}>
                <button onClick={onClose} className={styles.closeButton}>
                    <img src="/images/close.png" alt="" />
                </button>
                <div className={styles.modalHeader}>
                    <h3 className={styles.heading}>Enter the topic to be discussed</h3>
                    <TextInput fullwidth={ 'true' } value={ topic } onChange={(e) => setTopic(e.target.value)}/> {/* What ever we type will be set inside the setTopic local state*/}
                    <h2 className={styles.subHeading}>Room types</h2>
                    <div className={styles.roomTypes}>
                        <div 
                            onClick={() => setRoomType('open')}
                            className={`${styles.typeBox}
                            ${roomType === 'open' ? styles.active : ''}`}
                        >
                            <img src="/images/globe.png" alt="globe" />
                            <span>Open</span>
                        </div>
                        <div 
                            onClick={() => setRoomType('social')}
                            className={`${styles.typeBox}
                            ${roomType === 'social' ? styles.active : ''}`}
                        >
                            <img src="/images/social.png" alt="social" />
                            <span>Social</span>
                        </div>
                        <div 
                            onClick={() => setRoomType('private')}
                            className={`${styles.typeBox}
                            ${roomType === 'private' ? styles.active : ''}`}
                        >
                            <img src="/images/lock.png" alt="lock" />
                            <span>Private</span>
                        </div>
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <h2>Start a room, open to everyone</h2>
                    <button 
                        onClick={createRoom}
                        className={styles.footerButton}
                    >
                        <img src="/images/celebration.png" alt="celebration" />
                        <span>Let's go</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddRoomModal
