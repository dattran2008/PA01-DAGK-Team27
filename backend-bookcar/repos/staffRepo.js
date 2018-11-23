var md5 = require('crypto-js/md5');

var db = require('../data/bookcar-db');
var mysql = require('mysql');

var createConnection = () => {
    return mysql.createConnection({
    	host: 'localhost',
    	port: '3306',
    	user: 'root',
    	password: 'vantruong97',
    	database: 'bookcar'
    });
}

exports.add = userEntity => {
	// userEntity = {
    //     Username: 1,
    //     Password: 'raw pwd',
    // }

    //console.log(userEntity.Password + '|' + userEntity.Username);
    var md5_pwd = md5(userEntity.Password);
    var sql = `insert into staffs(Username, Password) values('${userEntity.Username}', '${md5_pwd}')`;

    return db.insert(sql);
}

exports.login = loginEntity => {
	// loginEntity = {
	// 	user: 'nndkhoa',
	// 	pwd: 'nndkhoa'
	// }

    var md5_pwd = md5(loginEntity.pwd);
	var sql = `select * from staffs where Username = '${loginEntity.user}' and Password = '${md5_pwd}'`;
	return db.load(sql);
}

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



