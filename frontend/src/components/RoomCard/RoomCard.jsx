import React from "react";
import styles from "./RoomCard.module.css";
import { useHistory } from "react-router-dom";

const RoomCard = ({ room }) => {
  const history = useHistory();

  return (
    <div
      onClick={() => {
        history.push(`/room/${room.id}`);
      }}
      className={styles.card}
    //   key={room.id}
    >
      <h3 className={styles.topic}>{room.topic}</h3>
      <div
        // key={room.id}
        className={`${styles.speakers} ${
          room.speakers.length === 1 ? styles.singleSpeaker : "" // If there's only one speaker in the room then apply this style
        }`}
      >
        <div className={styles.avatars}>
          {room.speakers.map((speaker) => (
            <img key={speaker.id} src={speaker.avatar} alt="speaker" />
          ))}
        </div>
        <div className={styles.names}>
          {room.speakers.map((speaker) => (
            <div key={speaker.id} className={styles.nameWrapper}>
              <span>{speaker.name}</span>
              <img
                // key={speaker.id}
                src="/images/chat-bubble.png"
                alt="chat-bubble"
              />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.peopleCount}>
        <span>{room.totalPeople}</span>
        <img src="/images/user-icon.png" alt="user-icon" />
      </div>
    </div>
  );
};

export default RoomCard;
