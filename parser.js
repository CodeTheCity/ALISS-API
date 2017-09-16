const milo=require('./parser-milo.js'),aliss=require('./parser-aliss.js'),gcd=require('./parser-gcd.js');

var parsers={
	'milo':milo,
	'aliss':aliss,
	//'gcd':gcd
};

module.exports={
	aggregateServices:function(json){
		var services=[];
		for (let service in json){
			console.log('Service '+service+'...');
			if (service in parsers){
				Array.prototype.push.apply(services,parsers[service].parse(json[service]));
			}else console.warn('No parser found for service \''+service+'\'!');
		}
		return services;
	}
};
