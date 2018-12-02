var express = require('express');

var driverRepo = require('../repos/driverRepo');
var authRepo = require('../repos/authRepo');
var db = require('../data/bookcar-db')
var router = express.Router();

router.post('/', (req, res) => {
	// req.body = {
	// 	user: 'nndkhoa',
	// 	pwd: 'nndkhoa'
	// }

	driverRepo.login(req.body)
		.then(rows => {
			if (rows.length > 0) {
				var driverEntity = rows[0];
				//console.log(userEntity.Username | userEntity.Password);
				var acToken = authRepo.generateDriverAccessToken(driverEntity);
				var rfToken = authRepo.generateRefreshToken();

				authRepo.updateRefreshTokenDriver(driverEntity.ID, rfToken)
					.then(value => {
						res.json({
							auth: true,
							user: driverEntity,
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
    var sql = `select ID from driverRefreshTokenExt where rfToken = '${refreshToken}'`;
    var ID; 
    db.load(sql)
        .then(rows=>{
          if(rows.length > 0)
          {
			ID = rows[0].ID;
            //console.log(ID);
            sql = `select * from accounts where ID = '${ID}' AND Type = 'Driver' `;
            db.load(sql)
                .then(results=>{
                  if(results.length > 0)
                	{
                         var newToken = authRepo.generateDriverAccessToken(results[0]);
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