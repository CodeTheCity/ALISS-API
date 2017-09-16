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
const fs=require('fs');

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

module.exports={
	query:function(query,callback){
		var results={};

		var race=new Race(function(){
			// All queries have finished
			console.log('All queries finished!');
			callback(results);
		});

		race.start(function(finish){
			// ALISS
			https.get({
				path:"/api/v2/search/?q="+query,
				hostname:"www.aliss.org",
				method:"GET",
				headers:{}
			},function(res){
				console.log('Status '+res.statusCode);
				console.log('Headers '+JSON.stringify(res.headers));
				let data='';
				res.on('data',function(chunk){
					data+=chunk;
				});
				res.on('end',function(){
					try{
						var res=JSON.parse(data);
						if ('results' in res){
							console.log('ALISS results: '+res.count);
							results.aliss=res.results;
						}
					}
					catch(err){
						console.error('ALISS error: '+err);
					}
					finish();
				});
			});
		});

		race.start(function(finish){
			// MILO
			https.get({
				path:"/web-content/milo-organisation/_search?q="+query,
				hostname:"50896fdf5c15388f8976945e5582a856.eu-west-1.aws.found.io",
				method:"GET",
				headers:{
					'Authorization':"Basic cmVhZG9ubHk6b25seXJlYWQ="
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
						var res=JSON.parse(data);
						if ('hits' in res){
							console.log('MILO results: '+res.hits.count);
							results.milo=res.hits.hits;
						}else{
							console.warn('No results from MILO');
						}
					}
					catch(err){
						console.error('MILO error: '+err);
					}
					finish();
				});
			});
		});

		race.start(function(finish){
			// GCD
			// TODO
			results.gcd=null;
			finish();
		});
	}
};