module.exports={
	parse:function(gcd){
        // TODO
        	return {
			"_id":null,
			"_service":"gcd-todo",
			"title":null,
			"description":null,
			"additionalInformation":null,
			"tags":[],
			"contact":{
				"email":null,
				"phone":null,
				"facebook":null,
				"twitter":null,
				"website":null
			},
			"location":{
				"coordinates":{
					"latitude":null,
					"longitude":null
				},
				"postcode":null,
				"street":null,
				"city":null,
				"country":null
			}
		};
	}
};
