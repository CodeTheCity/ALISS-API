module.exports={
	parse:function(milo){
		if (!('hits' in milo)){
			console.warn('No results from MILO');
			return [];
		}

		console.log('MILO results: '+milo.hits.total);
		milo=milo.hits.hits;

		milo=milo.map(function(item){
			var clean={};

			if ('_source' in item&&'title' in item._source) clean.title=item._source.title;

			return clean;
		});

		return milo;
	}
};
