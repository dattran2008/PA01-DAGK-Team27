const express = require('express');
const socketio = require('socket.io');
const request = require('request');
const moment = require('moment');
const customerRepo = require('../repos/customerRepo');
 var _ = require('lodash');

let io;

const router = express.Router();

function init(httpServer) {
	console.log('server active');
	io = socketio(httpServer);
}

module.exports.init = init;

// router.post('/', (req, res) => {
// 	if (req.body.name === ''
// 		|| req.body.phone_number === ''
// 		|| req.body.address === ''
// 		|| req.body.state === ''
// 	) {
// 		res.status(422).json({ msg: 'Invalid data' });
// 		return;
// 	}
// 	customerRepo.add(req.body)
// 		.then(value => {
// 			console.log(value);
// 			res.statusCode = 201;
// 			res.json(req.body);
// 			customerRepo.loadAll()
// 				.then(customers => {
// 					io.emit('getCustomers', customers);
// 				}).catch(err => {
// 					console.log(err);
// 				})
// 		})
// 		.catch(err => {
// 			console.log(err);
// 			res.statusCode = 500;
// 			res.end('View error log on console');
// 		})
// })

// router.put('/', (req, res) => {
// 	if (req.body.id === null
// 		|| req.body.name === ''
// 		|| req.body.phone_number === ''
// 		|| req.body.address === ''
// 		|| req.body.state === ''
// 	) {
// 		res.status(422).json({ msg: 'Invalid data' });
// 		return;
// 	}
// 	customerRepo.update(req.body)
// 		.then(value => {
// 			console.log(value);
// 			res.statusCode = 201;
// 			res.json(req.body);
// 			customerRepo.loadAll()
// 				.then(customers => {
// 					io.emit('getCustomers', customers);
// 				}).catch(err => {
// 					console.log(err);
// 				})
// 		})
// 		.catch(err => {
// 			console.log(err);
// 			res.statusCode = 500;
// 			res.end('View error log on console');
// 		})
// })

// router.get('/', (req, res) => {
// 	customerRepo.loadAll()
// 		.then(customers => {
// 			res.json(customers);
// 		}).catch(err => {
// 			console.log(err);
// 			res.statusCode = 500;
// 			res.end('View error log on console');
// 		})
// })

router.get('/', (req, res) => {
  customerRepo
    .loadAll()
    .then(rows => {
      res.statusCode = 200;
      // res.json(rows);
      res.send(
        _.sortBy(JSON.parse(JSON.stringify(rows)), [
          function(o) {
            return o.date_submitted;
          }
        ]).reverse()
      );
    })
    .catch(err => {
      console.log(err);
      res.statusCode = 500;
      res.end("View error log on console");
    });
});

// router.get("/request/:status", (req, res) => {
//   const reqStatus = req.params.status.trim().toLowerCase();

//   switch (reqStatus) {
//     case "unidentified+identified":
//       customerRepo
//         .loadUnidenAndIden()
//         .then(rows => {
//           res.statusCode = 200;
//           res.send(
//             _.sortBy(JSON.parse(JSON.stringify(rows)), [
//               function(o) {
//                 return o.date_submitted;
//               }
//             ]).reverse()
//           );
//         })
//         .catch(err => {
//           console.log(err);
//           res.statusCode = 500;
//           res.end("View error log on console");
//         });
//       break;
//     default:
//       customerRepo
//         .loadReqByStatus(reqStatus)
//         .then(rows => {
//           res.statusCode = 200;
//           res.send(
//             _.sortBy(JSON.parse(JSON.stringify(rows)), [
//               function(o) {
//                 return o.date_submitted;
//               }
//             ]).reverse()
//           );
//         })
//         .catch(err => {
//           console.log(err);
//           res.statusCode = 500;
//           res.end("View error log on console");
//         });
//       break;
//   }
// });

router.post('/', (req, res) => {
  const _req = req.body;
  const { address } = _req;
  const trimmedAddress = encodeURI(address.replace(" ", "+").trim());
  const opt = {
    uri: `https://maps.googleapis.com/maps/api/geocode/json?address=${trimmedAddress}&key=AIzaSyAt-z3ICdN7F6QAM0cUuw21ZUF_BYKMfw0`,
    headers: {
      "User-Agent": "Request-Promise"
    },
    json: true
  };

  request(opt).then(resp => {
    const { status } = resp;
    if (status !== "OK") {
      console.log("STATUS: ", status);
      res.statusCode = 500;
      res.json({
        status: "ZERO_RESULTS"
      });
      return;
    }

    const { lat, lng } = resp.results[0].geometry.location;
    _req.id = shortid.generate();
    _req.lat = lat;
    _req.lng = lng;
    customerRepo
      .add(_req)
      .then(() => {
        res.statusCode = 201;
        res.json(req.body);
      })
      .catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.json({
          status: "UNKNOWN_ERROR",
          message: err
        });
      });
  });
});

router.get("/request/coords/:reqId", (req, res) => {
  const reqId = req.params.reqId;
  customerRepo
    .getCoords(reqId)
    .then(value => {
      if (value.length > 0) {
        res.statusCode = 200;
        res.json({
          status: "OK",
          coords: value[0]
        });
      } else {
        res.statusCode = 404;
        res.json({
          status: "NOT_FOUND"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.statusCode = 500;
      res.json({
        status: "UNKNOWN_ERROR",
        message: err
      });
    });
});

router.patch("/request/coords", (req, res) => {
  const { reqId, newLat, newLng } = req.body;

  customerRepo
    .updateCoords(newLat, newLng, reqId)
    .then(result => {
      console.log(result);
      res.statusCode = 201;
      res.json({
        status: "OK"
      });
    })
    .catch(err => {
      console.log(err);
      res.statusCode = 500;
      res.end("View error log on console");
    });
});

router.patch("/request/status", (req, res) => {
  const reqId = req.body.reqId;
  console.log(reqId);

  console.log(req.body.status);
  const newStatus = req.body.status;

  customerRepo
    .updateStatus(newStatus, reqId)
    .then(result => {
      console.log(result);
      res.statusCode = 201;
      res.json({
        status: "OK"
      });
    })
    .catch(err => {
      console.log(err);
      res.statusCode = 500;
      res.end("View error log on console");
    });
});

router.patch("/request/driverId", (req, res) => {
  const reqId = req.body.reqId;
  const driverId = req.body.driverId;

  customerRepo
    .updateDriverId(driverId, reqId)
    .then(result => {
      console.log(result);
      res.statusCode = 201;
      res.json({
        status: "OK"
      });
    })
    .catch(err => {
      console.log(err);
      res.statusCode = 500;
      res.end("View error log on console");
    });
});

router.get("/request/findDriver", (req, res) => {
  driverRepo
    .findDriver()
    .then(value => {
      if (value.length > 0)
        res.status(200).json({ status: "OK", drivers: value });
      else res.status(202).json({ status: "NOT_FOUND" });
    })
    .catch(err => {
      console.log(err);
      res.statusCode = 202;
      res.end("View error log on console");
    });
});

router.post("/request/findDriver2", (req, res) => {
  driverRepo
    .findDriver()
    .then(rows => {
      if (rows.length > 0) {
        console.log(rows);
        res.status(200).json({ status: "OK", drivers: rows });
      } else {
        res.status(202).json({ status: "NOT_FOUND" });
      }
    })
    .catch(err => {
      console.log(err);
      res.statusCode = 202;
      res.end("View error log on console");
    });
});

module.exports.router = router;

