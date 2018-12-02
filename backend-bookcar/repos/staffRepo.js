var md5 = require('crypto-js/md5');

var db = require('../data/bookcar-db');
var mysql = require('mysql');


exports.add = userEntity => {
	// userEntity = {
    //     Username: 1,
    //     Password: 'raw pwd',
    // }

    //console.log(userEntity.Password + '|' + userEntity.Username);
    var md5_pwd = md5(userEntity.Password);
    var sql = `insert into accounts(Username, Password, Type) values('${userEntity.Username}', '${md5_pwd}', 'Staff')`;

    return db.insert(sql);
}

exports.login = loginEntity => {
	// loginEntity = {
	// 	UserName: 'nndkhoa',
	// 	pwd: 'nndkhoa'
	// }

    var md5_pwd = md5(loginEntity.Password);
	var sql = `select * from accounts where Username = '${loginEntity.Username}' and Password = '${md5_pwd}' and Type = 'Staff'`;
	return db.load(sql);
}
/*
var FindStaff = function(refreshToken){
    var sql = `select ID from staffRefreshTokenExt where rfToken = '${refreshToken}'`;
    var ID; 
    db.load(sql)
        .then(rows=>{
            if(rows.length > 0)
            {
                ID = rows[0].ID;
                console.log(ID);
                sql = `select * from staffs where ID = '${ID}' AND Type = 'Staff'`;
                return db.load(sql)
            }
        })
}

exports.FindStaff = FindStaff;

*/