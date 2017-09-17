const tool=require('./parsetools.js'),type=tool.type,include=tool.include;

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

		var clean=[];

		for (let item of milo){
			if ('_source' in item){
				item=item._source;
				clean.push({
					'_id':item.Id,
					'_service':'milo',
					'title':item.title,
					'description':item.description,
					'additionalInformation':item.text_bag,
					'tags':item['main_activities_global'],
					'contact':{
						'email':item.email,
						'phone':item.phone,
						'facebook':item.facebook,
						'twitter':item.twitter,
						'website':item.website
					},
					'location':(function(item){
						var latitude,longitude,postcode,street,city,country;
						if (item.geo){
							latitude=include(latitude,item.geo.latitude);
							longitude=include(longitude,item.geo.longitude);
							postcode=include(postcode,item.geo.postcode);
						}
						if (item.coords){
							latitude=include(latitude,item.coords.lat);
							longitude=include(longitude,item.coords.lat);
						}
						if (item.geo_coords){
							latitude=include(latitude,item.geo_coords.lat);
							longitude=include(longitude,item.geo_coords.lon);
						}

						postcode=include(postcode,item.location_postcode);
						street=include(street,item.location_street);
						city=include(city,item.location_city_county);

						return [{
							'coordinates':{
								'latitude':latitude,
								'longitude':longitude
							},
							'postcode':postcode,
							'address':[street,city,country].join(', ').trim()
						}];
					})(item)
				});
			}else{
				console.warn('PARSER-MILO: No _source in '+item);
			}
		}

		// TODO: Check for duplicates

		return clean;
	}
};
