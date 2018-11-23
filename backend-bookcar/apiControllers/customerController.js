const express = require('express');
const socketio = require('socket.io');
const request = require('request');
const moment = require('moment');
const customerRepo = require('../repos/customerRepo');
let io;

const router = express.Router();

function init(httpServer) {
	console.log('server active');
	io = socketio(httpServer);
}

module.exports.init = init;

router.post('/', (req, res) => {
	if(req.body.name === '' 
    || req.body.phone_number === '' 
    || req.body.address === '' 
    || req.body.state === ''
    ) {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
	customerRepo.add(req.body)
		.then(value => {
			console.log(value);
			res.statusCode = 201;
			res.json(req.body);
			request.get('http://localhost:3000/locate', (err, response, body) =>{
				io.emit('getCustomers', JSON.parse(body));
			})
		})
		.catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
		})
})

router.put('/', (req, res) => {
	if(req.body.id === null 
	|| req.body.name === '' 
    || req.body.phone_number === '' 
    || req.body.address === '' 
    || req.body.state === ''
    ) {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
	customerRepo.update(req.body)
		.then(value => {
			console.log(value);
			res.statusCode = 201;
			res.json(req.body);
			request.get('http://localhost:3000/locate', (err, response, body) =>{
				io.emit('getCustomers', JSON.parse(body));
			})
		})
		.catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
		})
})

router.get('/', (req, res) => {
	customerRepo.loadAll()
		.then(customers => {
			res.json(customers);
		}).catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
		})
})

module.exports.router = router;