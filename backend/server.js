require('dotenv').config(); // This will bring the credentials here in our application
const express = require('express');
const app = express();
const router = require('./routes');// This will import the router and it will go inside the router.js file and check/execute the endpoints there.
const DbConnect = require('./database');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const PORT = process.env.PORT || 5500;

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




app.listen(PORT, (req, res) => {
    console.log(`Listning on PORT ${PORT}`);
})