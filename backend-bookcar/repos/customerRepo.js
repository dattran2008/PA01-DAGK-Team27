const db = require('../data/bookcar-db');
const moment = require('moment');

exports.loadAll = () => {
	var sql = 'select * from customer order by rdt';
	return db.load(sql);
}

exports.add = customerEntity => {
    var rdt = moment().format('YYYY-MM-DD HH:mm:ss');
    var sql = `insert into customer(name, phone_number, address, note, state, rdt) 
    values('${customerEntity.name}', '${customerEntity.phone_number}', '${customerEntity.address}', '${customerEntity.note}', '${customerEntity.state}', '${rdt}')`;
    return db.insert(sql);
}

exports.update = customerEntity => {
    var sql = `update customer set state = '${customerEntity.state}' where id = ${customerEntity.id}`;
    return db.insert(sql);
}


// exports.add = requestEntity => {
//   const {
//     id,
//     clientName,
//     phone,
//     address,
//     date_submitted,
//     note,
//     status: statusReq,
//     lat,
//     lng
//   } = requestEntity;

//   const sql =
//     "insert into `request`(`id`, `clientName`, `phone`, `address`, `date_submitted`, `note`, `status`, `lat`, `lng`)" +
//     `values('${id}','${clientName}','${phone}','${address}', '${date_submitted}','${note}','${statusReq}',${lat},${lng});`;
//   return db.insert(sql);
// };




exports.updateCoords = (newLat, newLng, reqId) => {
  const sql =
    "update `request` set `lat` = " +
    `'${newLat}', ` +
    "`lng` = " +
    `'${newLng}' ` +
    "where `id`=" +
    `'${reqId}';`;
  return db.insert(sql);
};

exports.getCoords = reqId => {
  const sql =
    "select `lat`, `lng` from `request` where `id` = " + `'${reqId}';`;
  return db.load(sql);
};

exports.loadReqByStatus = (status) => {
  const sql = "select * from request where status = " + `'${status}'`;
  return db.load(sql);
};

exports.loadUnidenAndIden = () => {
  const status1 = 'UNIDENTIFIED';
  const status2 = 'IDENTIFIED';
  const sql = "select * from request where status = " + `'${status1}'` + "or status = " + `'${status2}'`;
  return db.load(sql);
};



exports.updateStatus = (newStatus, reqId) => {
  const sql =
    "update request set status = " + `'${newStatus}'` + " where id=" + `'${reqId}';`;
  return db.insert(sql);
};


exports.updateDriverId = (driverId, reqId) => {
  const sql =
    "update request set driverId = " + `'${driverId}'` + " where id=" + `'${reqId}';`;
  return db.insert(sql);
};