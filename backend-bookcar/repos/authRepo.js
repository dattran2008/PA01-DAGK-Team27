var jwt = require('jsonwebtoken');
var rndToken = require('rand-token');
var moment = require('moment');
 
var StaffRepo = require('./staffRepo');
var db = require('../data/bookcar-db');
var mysql = require('mysql')
const STAFF_SECRET = 'ABCDEF';
const DRIVER_SECRET = 'VANTRUONG97'
const AC_LIFETIME = 60; // seconds
//var Auth = require('./auth')



exports.generateStaffAccessToken = userEntity => {
    var payload = {
        user: userEntity,
        info: 'more info'
    }

    var token = jwt.sign(payload, STAFF_SECRET, {
        expiresIn: AC_LIFETIME
    });

    return token;
}

exports.generateDriverAccessToken = userEntity => {
    var payload = {
        user: userEntity,
        info: 'more info'
    }

    var token = jwt.sign(payload, DRIVER_SECRET, {
        expiresIn: AC_LIFETIME
    });

    return token;
}



exports.generateRefreshToken = () => {
    const SIZE = 80;
    return rndToken.generate(SIZE);
}

exports.updateRefreshTokenStaff= (userId, rfToken) => {
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


exports.generateDriverAccessTokenFromRefreshToken = driverRefreshToken =>{
    var sql = `select ID from driverRefreshTokenExt where rfToken = '${driverRefreshToken}'`;
                var ID; 
                db.load(sql)
                    .then(rows=>{
                        if(rows.length > 0)
                        {
                            ID = rows[0].ID;
                            console.log(ID);
                            sql = `select * from accounts where ID = '${ID}' AND Type = 'Driver' `;
                            return db.load(sql)
                            /*
                                .then(results=>{
                                    if(results.length > 0)
                                    {
                                        var newToken = exports.generateDriverAccessToken(results[0]);
                                        console.log('New token:        ' + newToken);
                                        return message.json({
                                            statusCode: 201,
                                            msg: 'New TOKEN',
                                            token: newToken,
                                            error: err
                                        })
                                    }
                                    else
                                    {

                                        return message.json({
                                        statusCode: 401,
                                        msg: 'INVALID TOKEN',
                                        error: err})
                                    }
                                })
                                */

                        }
                        else
                        {
                            return message.json({
                            statusCode: 401,
                            msg: 'INVALID TOKEN 2',
                            error: err})
                        }
                    })
}



exports.verifyAccessTokenStaff = (req, res, next) => {
    var token = req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, STAFF_SECRET, (err, payload) => {
            if (err) {
                if(err.name == 'TokenExpiredError')
               {
                    res.statusCode = 405;
                    res.json({
                        name: 'TokenExpiredError',
                        message: 'jwt expired',
                        error: err
                    })
                }
                else
                {
                    res.statusCode = 406;
                    res.json({
                        name: 'TokenInvalid',
                        message: 'jwt token invalid',
                        error: err
                    })
                }

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



exports.updateRefreshTokenDriver= (userId, rfToken) => {
    return new Promise((resolve, reject) => {

        var sql = `delete from driverRefreshTokenExt where ID = ${userId}`;
        db.insert(sql) // delete
            .then(value => {
                var rdt = moment().format('YYYY-MM-DD HH:mm:ss');
                sql = `insert into driverRefreshTokenExt values(${userId}, '${rfToken}', '${rdt}')`;
                return db.insert(sql);
            })
            .then(value => resolve(value))
            .catch(err => reject(err));
    });
}



exports.verifyAccessTokenDriver = (req, res, next) => {
    var token = req.headers['x-access-token'];
    const refreshToken = req.headers['refresh-token'];
    if (token) {
        jwt.verify(token, DRIVER_SECRET, (err, payload) => {
            if (err) {
                if(err.name == 'TokenExpiredError')
                {
                    res.statusCode = 405;
                    res.json({
                        name: 'TokenExpiredError',
                        message: 'jwt expired',
                        error: err
                    })
                }
                else
                {
                    res.statusCode = 406;
                    res.json({
                        name: 'TokenInvalid',
                        message: 'jwt token invalid',
                        error: err
                    })
                }

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
