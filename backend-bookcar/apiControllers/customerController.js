const express = require('express');
const moment = require('moment');
const customerRepo = require('../repos/customerRepo');

const router = express.Router();

router.post('/', (req, res) => {
	customerRepo.add(req.body)
		.then(value => {
			console.log(value);
			res.statusCode = 201;
			res.json(req.body);
		})
		.catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
		})
})

router.get('/', (req, res) => {
    var ts = 0;
    if (req.query.ts) {
        ts = +req.query.ts;
    }

    customerRepo.loadAll()
		.then(customers => {
            var return_ts = moment().unix();
			res.json({
                return_ts, 
                customers
            });
		}).catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
		})
})

module.exports = router;