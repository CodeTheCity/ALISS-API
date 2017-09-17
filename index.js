const PORT=process.env.PORT || 3000;
const express = require('express');
const app = express();
const db = require('./db.js');
const parser = require('./parser.js');

app.get('/',function(req, res){
	res.send('REST /');
});

app.get('/search', function(req, res){
	// TODO: search by location (lat,lon)
	// TODO: convert postcode to location
	if (req.query.q){
		let q=req.query.q;
		let lat=req.query.lat;
		let lon=req.query.lon;
		console.log("Query: "+q);
		db.query(q, lat, lon, function(services){
			var aggregation=parser.aggregateServices(services);
			res.type('json');
			res.send(JSON.stringify(aggregation));
		});
	}
});

app.get('/details/:service/:id', function(req, res){
	db.details(req.params.service, req.params.id, function(details){
		res.type('json');
		res.send(JSON.stringify(details));
	});
});

app.listen(PORT, function(){
	console.log('Server listening on port '+PORT);
});
