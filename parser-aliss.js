const tool=require('./parsetools.js'),type=tool.type,include=tool.include;

const parse = json => {
    if (!json.results) {
        return [];
    }

    return json.results.map(item => {
        return {
            "_id": item.id,
            "_service": "aliss",
            "title": item.title,
            "description": item.description,
            "additionalInformation": null,
            "tags": [],
            "contact": {
                "email": (function(string){
			// Try to find emails from this string
			
			var email=null;
			string.replace(/([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})/gi,function(...matches){
				email=include(email,matches[0].trim());
			});
			return email;
		})(item.description),
                "phone": (function(string){
			// Try to find a phone number from this string
			var phone=null;
			string.replace(/(tel(ephone)?|phone)\s*:?\s*((\+\d{1,3}|0)[\d\s]{5,18})/gi,function(...matches){
				phone=include(phone,matches[3].trim()); // 3rd group
			});
			return phone;
		})(item.description),
                "facebook": null,
                "twitter": null,
                "website": item.uri
            },
            "locations": item.locations ? item.locations.map(location => {
                [country, city, street] = location.formatted_address
                    .split(',', 3).reverse();

                return {
                    "coordinates": {
                        "latitude": location.lat,
                        "longitude": location.lon
                    },
                    "postcode": null,
                    "street": street,
                    "city": city,
                    "country": country
                };
            }) : [],
        }
    });
};

module.exports = {
    parse: parse
};
