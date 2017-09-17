const milo=require('./parser-milo.js'),aliss=require('./parser-aliss.js'),gcd=require('./parser-gcd.js');

var parsers={
	'milo':milo,
	'aliss':aliss,
	'gcd':gcd
};

function distance(x1,y1,x2,y2){
	return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

function shuffle(a){
	for (let i = a.length; i; i--) {
		let j = Math.floor(Math.random() * i);
		[a[i - 1], a[j]] = [a[j], a[i - 1]];
	}
}

module.exports={
	aggregateServices:function(json){
		var services=[];
		for (let service in json){
			console.log('Service '+service+'...');
			if (service in parsers){
				try{
					Array.prototype.push.apply(services,parsers[service].parse(json[service]));
				}
				catch(err){
					console.error(err);
				}
			}else console.warn('No parser found for service \''+service+'\'!');
		}

		// Sort services, do some mixing and matching
		// Right now we just shuffle the array
		shuffle(services);

		return services;
	}
};
