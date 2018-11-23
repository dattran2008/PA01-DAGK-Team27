const db = require('../data/bookcar-db');
const moment = require('moment');

exports.loadAll = () => {
	var sql = 'select * from customer order by rdt';
	return db.load(sql);
}

exports.add = customerEntity => {
    var rdt = moment().format('YYYY-MM-DD HH:mm:ss');
    var sql = `insert into customer(name, phone_number, address, note, state, rdt) values('${customerEntity.name}', '${customerEntity.phone_number}', '${customerEntity.address}', '${customerEntity.note}', '${customerEntity.state}', '${rdt}')`;
    return db.insert(sql);
}

exports.update = customerEntity => {
    var sql = `update customer set state = '${customerEntity.state}' where id = ${customerEntity.id}`;
    return db.insert(sql);
}