const express = require('express');
const app = express();
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

app.use('/customers', verifyAccessTokenStaff, customerCtrl);

app.listen(port, () => console.log("Server running on port " + port));