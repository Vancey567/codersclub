const RoomModel = require('../models/room-model');

class RoomService {
    async create(payload) {
        const { topic, roomType, ownerId } = payload;
        // When we we will create a room we will store the above data in the DB
        const room = await RoomModel.create({
            topic,
            roomType,
            ownerId,
            speakers: [ownerId],
        });
        return room;
    }

    async getAllRooms(types) {
        const rooms = await RoomModel.find({ roomType: {$in: types} }) // If we want to search using the items inside the array then we can use the mongodb {$in: types} here we need to pass the array(types) to the $in. It will give the values of all the record that matches. 
        .populate('speakers') // Populate the speakers and ownerId fields so that all the data from the refrence collection comes in place of speakers and ownerId field 
        .populate('ownerId')
        .exec(); // this will  
        return rooms;
    }

    async getRoom(roomId) {
        const room = await RoomModel.findOne({_id: roomId});
        return room;
    }
}

module.exports = new RoomService();