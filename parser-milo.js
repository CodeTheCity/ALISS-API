module.exports={
	parse:function(milo){
		console.log(milo);
		if ('hits' in milo){
			console.log('MILO results: '+milo.hits.total);
			var hits=milo.hits.hits;
		}else{
			console.warn('No results from MILO');
		}
		return [milo];
	}
};

const fs=require('fs');

var milo=JSON.parse(fs.readFileSync('milo.json'));
module.exports.parse(milo);
