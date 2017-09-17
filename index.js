const PORT=process.env.PORT || 3000;
const express = require('express');
const app = express();
const db = require('./db.js');
const parser = require('./parser.js');

global.https=require('https');
global.http=require('http');

app.get('/',function(req, res){
	res.send('REST /');
});

app.get('/search', function(req, res){
	// TODO: convert postcode to location
	var queryobject={};

	function search(queryobject){
		console.log("Query: "+queryobject);
		db.query(queryobject, function(services){
			var aggregation=parser.aggregateServices(services);
			res.type('json');
			res.send(JSON.stringify(aggregation));
		});
	}

	if (!req.query.distance) req.query.distance=5;
	if (req.query.lat&&req.query.lon){
		queryobject.area={lat:req.query.lat,lon:req.query.lon,distance:req.query.distance};
	}
	if (req.query.q){
		queryobject.query=req.query.q;
	}
	if (req.query.postcode){
		db.getPostcode(req.query.postcode,function(data){
			queryobject.area={lat:data.latitude,lon:data.longitude,distance:req.query.distance};
			search(queryobject);
		});
	}else search(queryobject);
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
