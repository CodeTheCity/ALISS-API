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

const milo=require('./db-milo.js'),aliss=require('./db-aliss.js'),gcd=require('./db-gcd.js');

var services={
	'aliss':aliss,
	'gcd':gcd,
	'milo':milo
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
