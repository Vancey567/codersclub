require('dotenv').config(); // This will bring the credentials here in our application
const express = require('express');
const app = express();
const router = require('./routes');// This will import the router and it will go inside the router.js file and check/execute the endpoints there.
const DbConnect = require('./database');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const PORT = process.env.PORT || 5500;

DbConnect(); // We will call the dbConnect and our database will be connected;


const corsOptions = {
    origin: ['http://localhost:3000'], // Pass the server url(client in this case) from where you are making a request
    credentials:true,            
    optionSuccessStatus:200,
}

app.use(cors(corsOptions));

app.use(express.json()); // To read the json data
app.use(router);
app.use(cookieParser());






app.listen(PORT, (req, res) => {
    console.log(`Listning on PORT ${PORT}`);
})