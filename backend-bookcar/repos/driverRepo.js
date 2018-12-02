var md5 = require('crypto-js/md5');

var db = require('../data/bookcar-db');
var mysql = require('mysql');


exports.add = DriverEntity => {
	// DriverrEntity = {
    //     Username: 1,
    //     Password: 'raw pwd',
    //     State: 'BUSY' / 'READY'
    // }

    //console.log(userEntity.Password + '|' + userEntity.Username);
    var md5_pwd = md5(DriverEntity.Password);
    var sql = `insert into accounts(Username, Password, Type, State) values('${DriverEntity.Username}', '${md5_pwd}', 'Driver', '${DriverEntity.State}')`;
    return db.insert(sql);
}

exports.login = loginEntity => {
	// loginEntity = {
	// 	UserName: 'nndkhoa',
	// 	Password: 'nndkhoa'
	// }

    var md5_pwd = md5(loginEntity.Password);
	var sql = `select * from accounts where Username = '${loginEntity.Username}' and Password = '${md5_pwd}' and Type = 'Driver'`;
	return db.load(sql);
}
/*
var FindStaff = function(refreshToken){
    var sql = `select ID from staffRefreshTokenExt where rfToken = '${refreshToken}'`;
    var ID; 
    var con = createConnection();
    con.query(sql, function(err, results) {
        if (err) throw err;
        if(results.length > 0)
        {
            ID = results[0].ID;
            sql = `select * from staffs where ID = '${ID}'`;
            con.query(sql, function(err, results) {
                if (err) throw err;
                if(results.length > 0)
                {
                    return results[0];
                }
              });
        
        }
        //console.log('Result' + results[0]);
      });

}

exports.FindStaff = FindStaff;

*/

