const parse = json => {
    if(!json.results){
        return [];
    }

    return json.results.map(item => {
        return {
            title: item.title,
        }
    });
};

module.exports={
    parse: parse
};
