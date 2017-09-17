const PORT=process.env.PORT || 3000;
const express = require('express');
const app = express();
const db = require('./db.js');
const parser = require('./parser.js');

app.get('/',function(req, res){
	res.send('REST /');
});

app.get('/search', function(req, res){
	// TODO: convert postcode to location
	var queryobject={};
	if (req.query.lat&&req.query.lon){
		queryobject.area={lat:req.query.lat,lon:req.query.lon,distance:req.query.distance};
	}
	if (req.query.q){
		queryobject.query=req.query.q;
	}

	console.log("Query: "+queryobject);
	db.query(queryobject, function(services){
		var aggregation=parser.aggregateServices(services);
		res.type('json');
		res.send(JSON.stringify(aggregation));
	});
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
