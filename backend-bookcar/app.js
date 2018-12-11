var express = require('express'), 
    http = require('http'),
    app = express(),
    server = http.Server(app),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors');

const port = process.env.PORT || 3000;

const customerCtrl = require('./apiControllers/customerController');

const staffCtrl = require('./apiControllers/staffControllers');
const staffLoginCtrl = require('./apiControllers/staffLoginController');
const verifyAccessTokenStaff = require('./repos/authRepo').verifyAccessTokenStaff;

const driverCtrl = require('./apiControllers/driverController');
const driverLoginCtrl = require('./apiControllers/driverLoginController');
const verifyAccessTokenDriver = require('./repos/authRepo').verifyAccessTokenDriver;


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(cors());

app.get('/', (req, res) => {
    res.json({
        msg: 'Welcome to bookcar'
    })
});

//Staff
app.use('/staff/login', staffLoginCtrl);
app.use('/staffs', verifyAccessTokenStaff, staffCtrl);

// Driver
app.use('/driver/login', driverLoginCtrl);
app.use('/drivers', verifyAccessTokenDriver, driverCtrl);

// Customer
customerCtrl.init(server);
app.use('/request', customerCtrl.router);

server.on('connection', () => {
    console.log('connection');
});

// app.listen(port, () => console.log("Server running on port " + port));
server.listen(port, () => {
    console.log(`listening on :${port}`);
});