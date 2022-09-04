const RoomDto = require("../dtos/room-dto");
const roomService = require("../services/room-service");

class RoomsController {
    async create(req, res) {
        const { topic, roomType } = req.body;

        if(!topic || !roomType) {
            return res.status(400).json({message: "All Fields are required"})
        }

        const room = await roomService.create({ 
            topic,
            roomType,
            ownerId: req.user._id // Who is creating this room? One who is loggedIn So pass his id from req.user.id, Since we are sending the token with the middleware so our middlware sets the user id from the token to the req.body 
        })

        return res.json(new RoomDto(room));
    }

    async index(req, res) {
        const rooms = await roomService.getAllRooms(['open']); // pass the type of the room you want inside getAllRooms()
        const allRooms = rooms.map(room => new RoomDto(room));
        return res.json(allRooms);
    }

    async show(req, res) {
        const room = await roomService.getRoom(req.params.roomId);
        return res.json(room);
    }
}

module.exports = new RoomsController(); // Singleton Instance