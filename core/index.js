const PORT=3000;
const express = require('express');
const app = express();
const db = require('./db.js');
const parser = require('./parser.js');

app.get('/',function(req,res){
	res.send('REST /');
});

app.get('/search', function(req, res){
	if (req.query.q){
		let q=req.query.q;
		console.log("Query: "+q);
		db.query(q,function(services){
			var aggregation=parser.aggregateServices(services);
			res.send(JSON.stringify(aggregation));
		});
	}
});

app.listen(PORT,function(){
	console.log('Server listening on port '+PORT);
});
