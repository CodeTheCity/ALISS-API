module.exports = {
    getDetails:function(id,callback){
        callback({});
    },
    query:function(qo,callback){
        var query=qo.query,area=qo.area;
        let path = "/api/v2/search/?q="+encodeURIComponent(query);

        if(area){
            path += `latitude=${area.lat}&longitude=${area.lon}&distance=${area.distance}`;
        }

        https.get({
            path:path,
            hostname:"www.aliss.org",
            method:"GET",
            headers:{
                'Accept':'application/json'
            }
        },function(res){
            console.log('Status '+res.statusCode);
            console.log('Headers '+JSON.stringify(res.headers));
            let data='';
            res.on('data',function(chunk){
                data+=chunk;
            });
            res.on('end',function(){
                try{
                    callback(JSON.parse(data));
                }
                catch(err){
                    console.error('ALISS error: '+err);
                }
            });
        });
    }
};
