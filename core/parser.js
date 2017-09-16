
module.exports={
	aggregateServices:function(json){
		var aggregation={};
		for (let service in json){
			console.log('Service '+service+'...');
			// Currently doesn't do anything
			aggregation[service]=json[service];
		}
		return aggregation;
	}
};
