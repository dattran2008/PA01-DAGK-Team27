var express = require('express');

var driverRepo = require('../repos/driverRepo');
var authRepo = require('../repos/authRepo')
var router = express.Router();

router.post('/', (req, res) => {
	driverRepo.add(req.body)
		.then(value => {
			console.log(value);
			res.statusCode = 201;
			res.json(req.body);
		})
		.catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
		})
})



router.get('/', (req, res) => {
    res.json({
        msg: 'Welcome to driver Api'
    })
});



module.exports = router;