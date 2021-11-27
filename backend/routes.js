const router = require('express').Router();// We get Router() "function" on express which need to be called here

// We will mount the routes here and export the route at the end.
// Here will give the reference to the function which will contain the logic and will be called once we hit the desired endpoint.
// For that we will use MVC Pattern
const authController = require('./controllers/auth-controller'); // AuthController has the objec of the class here


router.post('/api/send-otp', authController.sendOtp);
router.post('/api/verify-otp', authController.verifyOtp);

module.exports = router;

// Backend:  [ require(), module.exports = router ] is a nodejs way called common JS syntax
// Frontend: [ import from './path', export default App ] is Javascript ES6 module system