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
                "email": null,
                "phone": null,
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
