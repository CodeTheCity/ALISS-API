module.exports={
	parseDetails:function(){
		
	},
	parse:function(milo){
		if (!('hits' in milo)){
			console.warn('No results from MILO');
			return [];
		}

		console.log('MILO results: '+milo.hits.total);
		milo=milo.hits.hits;

		milo=milo.map(function(item){
			if ('_source' in item){
				item=item._source;
				return {
					'_id':item.Id,
					'_service':'milo',
					'title':item.title,
					'description':item.description,
					'additionalInformation':item.text_bag,
					'tags':item['main_activities_global-slugs'],
					'contact':{}, //TODO
					'location':{} //TODO
				};
			}else{
				console.warn('PARSER-MILO: No _source in '+item);
				return {};
			}
		});

		return milo;
	}
};
