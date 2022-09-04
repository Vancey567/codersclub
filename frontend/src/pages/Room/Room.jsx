import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import useWebRTC from "../../hooks/useWebRTC";
import { useSelector } from "react-redux";
import { getRoom } from "../../http/index";
import styles from "./Room.module.css";

const Room = () => {
  const { id: roomId } = useParams(); // we will get the roomId from the params using useParams() hook. roomId is the alias of the id.
  const user = useSelector((state) => state.auth.user); // we will get the user from the store.
  const { clients, provideRef, handleMute } = useWebRTC(roomId, user); // To fetch the data of the client we wil be making a custom hook called webRTC which will fetch the data and will return it as object here. When your logic is getting big then try to move it somewhere else by making it as the custom hook, we will pass the current loggedIn user and roomId
  // Whenever a new client joins/adds in our state we will need to handle a side Effect.
  // For that we will make one more custom hook.
  // In class based components, there's a callback inside the setState() method. That callback executes when your state gets updated. But hook do not have anything like that. So we will custom implement that callback feature using custom hooks.
  const history = useHistory();
  const [room, setRoom] = useState(null);
  const [isMute, setMute] = useState(true);

  useEffect(() => {
    handleMute(isMute, user.id); // current loggedIn user
  }, [isMute]);

  const handleManualLeave = () => {
    history.push("/rooms"); // redirect on this /room url
  };

  useEffect(() => {
    const fetchRoom = async () => {
      const { data } = await getRoom(roomId);
      setRoom((prev) => data);
    };
    fetchRoom();
  }, [roomId]);

  const handleMuteClick = (clientId) => {
    if(clientId !== user.id) return;
    setMute((isMute) => !isMute);
  }

  return (
    <div className="container">
      <div className="container">
        <button
          onClick={handleManualLeave}
          className={styles.goBack && styles.actionBtn}
        >
          <img src="/images/arrow-left.png" alt="arrow-left" />
          <span>All voice rooms</span>
        </button>
      </div>
      <div className={styles.clientWrap}>
        <div className={styles.header}>
          <h2 className={styles.topic}>{room?.topic}</h2>
          <div className={styles.actions}>
            <button className={styles.actionBtn}>
              <img src="/images/palm.png" alt="palm-icon" />
            </button>
            <button className={styles.actionBtn} onClick={handleManualLeave}>
              <img src="/images/win.png" alt="win-icon" />
              <span>Leave quietly</span>
            </button>
          </div>
        </div>

        <div className={styles.clientsList}>
          {clients.map((client) => {
            return (
              <div className={styles.client} key={client.id}>
                <div className={styles.userHead}>
                  <img
                    className={styles.userAvatar}
                    src={client.avatar}
                    alt=""
                  />
                  <audio
                    autoPlay
                    ref={(instance) => {
                      provideRef(instance, client.id);
                    }}
                  />
                  <button
                    onClick={() => handleMuteClick(client.id)}
                    className={styles.micBtn}
                  >
                    {client.muted ? (
                      <img 
                        className={styles.mic}
                        src="/images/mic-mute.png"
                        alt="mic"
                      />
                    ) : (
                      <img
                        className={styles.micImg}
                        src="/images/mic.png"
                        alt="mic"
                      />
                    )}
                  </button>
                </div>
                <h4>{client.name}</h4>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Room;
