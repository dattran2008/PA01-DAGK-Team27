var db = require('../data/bookcar-db');

exports.loadAll = () => {
	var sql = 'select * from customer';
	return db.load(sql);
}