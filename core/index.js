const express = require('express');
const app = express();
const db = require('./db.js');

app.get('/search', function(req, res){
	if (req.query.q){
		let q=req.query.q;
		console.log("Query: "+q);
		db.query(q);
	}
});
