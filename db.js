/*
 *	db.js
 *	Connects to all the three databases and requests a single query from them
 *	Returns a JSON file in the format:
 *	{
 *		"aliss":<data from ALISS>,
 *		"gcd":<data from GCD>,
 *		"milo":<data from MILO>
 *	}
 *
 *	Exports:
 *		db.query(<querystring>,<callback>);
 *		for example:
 *		db.query("cancer",function(json){
 *			console.log(json.milo.hits);
 *		})
 *
 * */

const http=require('http'),https=require('https');

function Race(callback){
	this.running=0;
	this.finished=false;
	this.callback=callback||function(){};
}
Race.prototype={
	start:function(f){
		if (!this.finished) this.running++;
		let self=this;
		if (f) f(function(){
			self.finish();
		});
	},
	finish:function(){
		if (!this.finished&&--this.running==0){
			this.finished=true;
			this.callback();
		}
	}
};

var services={
	'aliss':{
		getDetails:function(id,callback){
			callback({});
		},
		query:function(qo,callback){
			var query=qo.query,area=qo.area;
			const path = "/api/v2/search/?q="+encodeURIComponent(query);

			if(area){
				// TODO
			}

			https.get({
				path:path,
				hostname:"www.aliss.org",
				method:"GET",
				headers:{
					'Accept':'application/json'
				}
			},function(res){
				console.log('Status '+res.statusCode);
				console.log('Headers '+JSON.stringify(res.headers));
				let data='';
				res.on('data',function(chunk){
					data+=chunk;
				});
				res.on('end',function(){
					try{
						callback(JSON.parse(data));
					}
					catch(err){
						console.error('ALISS error: '+err);
					}
				});
			});
		}
	},
	'gcd':{
		getDetails:function(id,callback){
			// TODO: this
			callback({});
		},
		query:function(qo,callback){
			var query=qo.query,area=qo.area;
			
			let page=1; //for now
			http.get({
				path:"/api/_search/"+encodeURIComponent(query)+"/"+page,
				hostname:"devsalute-001-site4.etempurl.com",
				method:"GET",
				headers:{
					'Accept':'application/json'
				}
			},function(res){
				console.log('Status '+res.statusCode);
				console.log('Headers '+JSON.stringify(res.headers));
				let data='';
				res.on('data',function(chunk){
					data+=chunk;
				});
				res.on('end',function(){
					try{
						callback(JSON.parse(data));
					}
					catch(err){
						console.error('GCD error: '+err);
						callback({});
					}
				});
			});
		}
	},
	'milo':{
		getDetails:function(id,callback){
			https.get({
				path:"/web-content/milo-organisation/"+id,
				hostname:"50896fdf5c15388f8976945e5582a856.eu-west-1.aws.found.io",
				method:"GET",
				headers:{
					'Authorization':"Basic cmVhZG9ubHk6b25seXJlYWQ=",
					'Accept':'application/json'
				}
			},function(res){
				console.log('Status '+res.statusCode);
				console.log('Headers '+JSON.stringify(res.headers));
				let data='';
				res.on('data',function(chunk){
					data+=chunk;
				});
				res.on('end',function(){
					try{
						callback(JSON.parse(data));
					}
					catch(err){
						console.error('MILO error: '+err);
						callback({});
					}
				});
			});
		},
		query:function(qo,callback){
			var query=qo.query,area=qo.area;

			var request=https.request({
				path:"/web-content/milo-organisation/_search",
				hostname:"50896fdf5c15388f8976945e5582a856.eu-west-1.aws.found.io",
				method:"POST",
				headers:{
					'Authorization':"Basic cmVhZG9ubHk6b25seXJlYWQ=",
					'Accept':'application/json'
				}
			},function(res){
				console.log('Status '+res.statusCode);
				console.log('Headers '+JSON.stringify(res.headers));
				let data='';
				res.on('data',function(chunk){
					data+=chunk;
				});
				res.on('end',function(){
					try{
						callback(JSON.parse(data));
					}
					catch(err){
						console.error('MILO error: '+err);
						callback({});
					}
				});
			});

			request.on('error',function(err){
				console.log('MILO request error: '+err);
			});

			var json={
				from:0,
				query:{
					bool:{
						must:[{
							simple_query_string:{
								query:query,
								default_operator:"AND"
							}
						}]
					}
				}
			};

			if (area){
				// Search by location
				//
				console.log('MILO: lat %s lon %s',area.lat,area.lon);
				json.sort={
					_geo_distance:{
						coords:{
							lat:area.lat,
							lon:area.lon
						},
						distance_type:"arc",
						order:"asc",
						unit:"mi"
					}
				};
			}

			request.write(JSON.stringify(json));
			request.end();
		}
	}
};

module.exports={
	details:function(service,id,callback){
		if (service in services){
			services[service].getDetails(id,callback);
		}else console.error('Cannot get details; service \''+service+'\' not in services!');
	},
	query:function(qo, callback){
		var results={};

		var race=new Race(function(){
			// All queries have finished on race finish
			console.log('All queries finished!');
			callback(results);
		});

		for (let service in services){
			console.log('Querying service '+service+'...');
			race.start(function(finish){
				services[service].query(qo,function(res){
					results[service]=res;
					console.log('Service '+service+' finished.');
					finish();
				});
			});
		}
	}
};
