const ACTIONS = { // since we will be storing some constants here so we write in in capital letters
    JOIN: 'join',
    LEAVE: 'leave',
    ADD_PEER: 'add_peer',
    RELAY_ICE: 'relay_ice',
    RELAY_SDP: 'relay_sdp',
    ICE_CANDIDATE: 'ice_candidate',
    SESSION_DESCRIPTION: 'session_description',
    REMOVE_PEER: 'remove_peer',
    MUTE: 'mute',
    UNMUTE: 'unmute',
}

module.exports = ACTIONS;