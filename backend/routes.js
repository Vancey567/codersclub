const router = require('express').Router();// We get Router() "function" on express which need to be called here

// We will mount the routes here and export the route at the end.
// Here will give the reference to the function which will contain the logic and will be called once we hit the desired endpoint.
// For that we will use MVC Pattern
const authController = require('./controllers/auth-controller'); // AuthController has the objec of the class here
const activateController = require('./controllers/activate-controller'); // AuthController has the objec of the class here
const authMiddleware = require('./middlewares/auth-middleware');

router.post('/api/send-otp', authController.sendOtp);
router.post('/api/verify-otp', authController.verifyOtp);
router.post('/api/activate', authMiddleware, activateController.activate);// This route should be protected cuz the user is already logggedIn onto the client.It has accessToken, refreshToken. So we allow on this route who have valid accesstoken and refreshToken. For that we will create a middleware to verify the token. If the token is valid we will continue the request to the next else we will give a response to the user to enter valid credentials
router.get('/api/refresh', authController.refresh);
router.post('/api/logout', authMiddleware, authController.logout);


module.exports = router;

// Backend:  [ require(), module.exports = router ] is a nodejs way called common JS syntax
// Frontend: [ import from './path', export default App ] is Javascript ES6 module system