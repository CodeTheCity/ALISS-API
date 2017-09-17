module.exports={
	parse:function(gcd){
		// TODO
		var clean=[];

		var services=gcd.Services;
		
		if (services){
			for (let service of services){
				clean.push({
					"_id":service.id,
					"_service":"gcd",
					"title":service.title,
					"description":service.field_description,
					"additionalInformation":service.field_services,
					"tags":service.metakey ? service.metakey.trim().split(/\s+/) : [],
					"contact":{
						"email":service.field_email,
						"phone":[service.field_phone,service.field_phone2].join(' ').trim(),
						"facebook":service.field_facebook,
						"twitter":service.field_twitter,
						"website":service.field_website
					},
					"locations":(function(service){
						return [{
							"coordinates":{
								"latitude":service.field_latitude,
								"longitude":service.field_longitude
							},
							"postcode":service.field_postcode,
							"address":[service.field_street,service.field_address2,service.field_address3,service.field_city].filter(r=>{if (r&&r.trim()!='') return true;}).join(' ').trim()
						}];
					})(service)
				});
			}
		}else{
			console.warn('No results from GCD');
		}

		return clean;
	}
};
