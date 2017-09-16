const parse = json => {
    if(!json.results){
        return [];
    }

    return json.results.map(item => {
        return {
            _service: 'aliss',
            title: item.title,
            description: item.description,
        }
    });
};

module.exports={
    parse: parse
};
