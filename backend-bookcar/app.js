const express = require('express');
const http = require('http');
const app = express();
const server = http.Server(app);
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const port = process.env.PORT || 3000;
const customerCtrl = require('./apiControllers/customerController');
const staffCtrl = require('./apiControllers/staffControllers');
const verifyAccessTokenStaff = require('./repos/authRepo').verifyAccessTokenStaff;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({
        msg: 'Welcome to bookcar'
    })
});

app.use('/staffs', staffCtrl);

customerCtrl.init(server);
app.use('/customers', verifyAccessTokenStaff, customerCtrl.router);

server.on('connection', () => {
    console.log('connection');
});

// app.listen(port, () => console.log("Server running on port " + port));
server.listen(port, () => {
    console.log(`listening on *:${port}`);
});