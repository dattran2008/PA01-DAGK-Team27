var express = require('express');

var staffRepo = require('../repos/staffRepo');

var router = express.Router();

router.post('/', (req, res) => {
	staffRepo.add(req.body)
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
        msg: 'Welcome to staff Api'
    })
});


router.post('/acess', (req, res) =>{
	var refreshToken = req.header['refresh-token'];
	authRepo.generateStaffAccessTokenFromRefreshToken(refreshToken);
})


module.exports = router;