var express = require('express');

var staffRepo = require('../repos/staffRepo');
var authRepo = require('../repos/authRepo');

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


 

router.post('/login', (req, res) => {
	// req.body = {
	// 	user: 'nndkhoa',
	// 	pwd: 'nndkhoa'
	// }

	staffRepo.login(req.body)
		.then(rows => {
			if (rows.length > 0) {
				var userEntity = rows[0];
				//console.log(userEntity.Username | userEntity.Password);
				var acToken = authRepo.generateAccessToken(userEntity);
				var rfToken = authRepo.generateRefreshToken();

				authRepo.updateRefreshTokenUser(userEntity.id, rfToken)
					.then(value => {
						res.json({
							auth: true,
							user: userEntity,
							access_token: acToken,
							refresh_token: rfToken
						})
					})
					.catch(err => {
						console.log(err);
						res.statusCode = 500;
						res.end(' View error log on console');
					})
			} else {
				res.json({
					auth: false
				})
			}
		})
		.catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
		})
})

module.exports = router;