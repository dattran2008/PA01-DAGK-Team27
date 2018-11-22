var jwt = require('jsonwebtoken');
var rndToken = require('rand-token');
var moment = require('moment');
 
var StaffRepo = require('./staffRepo');
var db = require('../data/bookcar-db');
var mysql = require('mysql')
const SECRET = 'ABCDEF';
const AC_LIFETIME = 60; // seconds
//var Auth = require('./auth')

var createConnection = () => {
    return mysql.createConnection({
    	host: 'localhost',
    	port: '3306',
    	user: 'root',
    	password: 'vantruong97',
    	database: 'bookcar'
    });
}


exports.generateAccessToken = userEntity => {
    var payload = {
        user: userEntity,
        info: 'more info'
    }

    var token = jwt.sign(payload, SECRET, {
        expiresIn: AC_LIFETIME
    });

    return token;
}


exports.generateRefreshToken = () => {
    const SIZE = 80;
    return rndToken.generate(SIZE);
}

exports.updateRefreshTokenUser= (userId, rfToken) => {
    return new Promise((resolve, reject) => {

        var sql = `delete from staffRefreshTokenExt where ID = ${userId}`;
        db.insert(sql) // delete
            .then(value => {
                var rdt = moment().format('YYYY-MM-DD HH:mm:ss');
                sql = `insert into staffRefreshTokenExt values(${userId}, '${rfToken}', '${rdt}')`;
                return db.insert(sql);
            })
            .then(value => resolve(value))
            .catch(err => reject(err));
    });
}



exports.verifyAccessTokenStaff = (req, res, next) => {
    var token = req.headers['x-access-token'];
    const refreshToken = req.headers['refresh-token'];
    if (token) {
        jwt.verify(token, SECRET, (err, payload) => {
            if (err) {


                //console.log(refreshToken);
                var sql = `select ID from staffRefreshTokenExt where rfToken = '${refreshToken}'`;
                var ID; 
                
                var con = createConnection();
                con.query(sql, function(err, results1) {
                    if (err) throw err;
                    if(results1.length > 0)
                    {
                        ID = results1[0].ID;
                        console.log(ID);
                        sql = `select * from staffs where ID = '${ID}'`;
                        con.query(sql, function(err, results2) {
                            if (err) throw err;
                            console.log(results2[0]);
                            if(results2.length > 0)
                            {
                                var newToken = exports.generateAccessToken(results2[0]);
                                console.log('New token:        ' + newToken);
                                console.log(res);
                                res.statusCode = 201;
                                res.json({
                                    msg: 'New TOKEN',
                                    token: newToken,
                                    error: err
                                })
                            }
                            else{
                                res.statusCode = 401;
                                res.json({
                                msg: 'INVALID TOKEN',
                                error: err})
                            }
                          });
                    
                    }
                    
                  });
                  /*
                var rows = db.load(sql)
                if (rows.length > 0) {
                    var ID = rows[0];
                    console.log('ID:  ' + ID);
                    sql = `select * from staffs where ID = '${ID}'`;
                    rows = db.load(sql)
                    
                    if(rows.length > 0)
                                
                    var newToken = exports.generateAccessToken(rows[0]);
                    console.log('New token:        ' + newToken);
                    console.log(res);
                    res.statusCode = 201;
                    res.json({
                        msg: 'New TOKEN',
                        token: newToken,
                        error: err
                        })
                    }
                else{
                    res.statusCode = 401;
                    res.json({
                    msg: 'INVALID TOKEN',
                    error: err
                    })
                }*/
            } else {
                req.token_payload = payload;
                next();
            }
        });
    } else {
        res.statusCode = 403;
        res.json({
            msg: 'NO_TOKEN'
        })
    }
}

