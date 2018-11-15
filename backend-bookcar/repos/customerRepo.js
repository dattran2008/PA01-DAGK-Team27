var db = require('../data/bookcar-db');

exports.loadAll = () => {
	var sql = 'select * from customer';
	return db.load(sql);
}

exports.add = customerEntity => {
    var sql = `insert into customer(name, phone_number, address, note, state) values('${customerEntity.name}', '${customerEntity.phone_number}', '${customerEntity.address}', '${customerEntity.note}', '${customerEntity.state}')`;

    return db.insert(sql);
}