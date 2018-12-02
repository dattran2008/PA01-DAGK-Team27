const express = require('express');
const http = require('http');
const app = express();
const server = http.Server(app);
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const port = process.env.PORT || 3000;
<<<<<<< HEAD

const customerCtrl = require('./apiControllers/customerController'),
    staffCtrl = require('./apiControllers/staffControllers'),
    verifyAccessTokenStaff = require('./repos/authRepo').verifyAccessTokenStaff,
    guestCtrl = require('./apiControllers/guestController');
=======
const customerCtrl = require('./apiControllers/customerController');
const staffCtrl = require('./apiControllers/staffControllers');
const staffLoginCtrl = require('./apiControllers/staffLoginController');
const verifyAccessTokenStaff = require('./repos/authRepo').verifyAccessTokenStaff;
>>>>>>> token

const driverCtrl = require('./apiControllers/driverController');
const driverLoginCtrl = require('./apiControllers/driverLoginController');
const verifyAccessTokenDriver = require('./repos/authRepo').verifyAccessTokenDriver;


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({
        msg: 'Welcome to bookcar'
    })
});

<<<<<<< HEAD
customerCtrl.init(server);

app.use('/staffs', staffCtrl);
app.use('/locate', verifyAccessTokenStaff, customerCtrl.router);
//app.use('/guest', guestCtrl);
=======

app.use('/staff/login', staffLoginCtrl);
app.use('/staffs', verifyAccessTokenStaff, staffCtrl);

app.use('/driver/login', driverLoginCtrl);
app.use('/drivers',verifyAccessTokenDriver, driverCtrl);

customerCtrl.init(server);
app.use('/locate', customerCtrl.router);
>>>>>>> token

server.on('connection', () => {
    console.log('connection');
});

// app.listen(port, () => console.log("Server running on port " + port));
server.listen(port, () => {
    console.log(`listening on *:${port}`);
});