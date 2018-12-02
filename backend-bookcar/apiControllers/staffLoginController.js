var express = require('express');

var staffRepo = require('../repos/staffRepo');
var authRepo = require('../repos/authRepo');
var db = require('../data/bookcar-db')
var router = express.Router();

router.post('/', (req, res) => {
	// req.body = {
	// 	user: 'nndkhoa',
	// 	pwd: 'nndkhoa'
	// }

	staffRepo.login(req.body)
		.then(rows => {
			console.log(rows);
			if (rows.length > 0) {
				var userEntity = rows[0];
				//console.log(userEntity.Username | userEntity.Password);
				var acToken = authRepo.generateStaffAccessToken(userEntity);
				var rfToken = authRepo.generateRefreshToken();

				authRepo.updateRefreshTokenStaff(userEntity.ID, rfToken)
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


router.post('/access', (req, res) =>{
	var refreshToken = req.headers['refresh-token'];
	console.log(refreshToken);
    var sql = `select ID from staffRefreshTokenExt where rfToken = '${refreshToken}'`;
    var ID; 
    db.load(sql)
        .then(rows=>{
          if(rows.length > 0)
          {
			ID = rows[0].ID;
            //console.log(ID);
            sql = `select * from accounts where ID = '${ID}' AND Type = 'Staff' `;
            db.load(sql)
                .then(results=>{
                  if(results.length > 0)
                	{
                         var newToken = authRepo.generateStaffAccessToken(results[0]);
                         console.log('New token:        ' + newToken);
                                        
						res.statusCode = 201;
						res.json({
                            msg: 'New TOKEN',
                            token: newToken
							 })
                    }
                    else
                    {
						res.statusCode= 401;
						res.json({
                        msg: 'INVALID TOKEN'
						})
                    }
                })

            }
            else
            {
                            
				res.statusCode = 401,
				res.json({
                msg: 'INVALID TOKEN 2'})
            }
        })
})


module.exports = router;