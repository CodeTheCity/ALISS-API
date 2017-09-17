module.exports = {
    getDetails:function(id,callback){
        https.get({
            path:"/web-content/milo-organisation/"+id,
            hostname:"50896fdf5c15388f8976945e5582a856.eu-west-1.aws.found.io",
            method:"GET",
            headers:{
                'Authorization':"Basic cmVhZG9ubHk6b25seXJlYWQ=",
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
                    console.error('MILO error: '+err);
                    callback({});
                }
            });
        });
    },
    query:function(qo,callback){
        var query=qo.query,area=qo.area;

        var request=https.request({
            path:"/web-content/milo-organisation/_search",
            hostname:"50896fdf5c15388f8976945e5582a856.eu-west-1.aws.found.io",
            method:"POST",
            headers:{
                'Authorization':"Basic cmVhZG9ubHk6b25seXJlYWQ=",
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
                    console.error('MILO error: '+err);
                    callback({});
                }
            });
        });

        request.on('error',function(err){
            console.log('MILO request error: '+err);
        });

        var json={
            from:0,
            query:{
                bool:{
                    must:[{
                        simple_query_string:{
                            query:query,
                            default_operator:"AND"
                        }
                    }]
                }
            }
        };

        if (area){
            // Search by location
            //
            console.log('MILO: lat %s lon %s',area.lat,area.lon);
            json.sort={
                _geo_distance:{
                    coords:{
                        lat:area.lat,
                        lon:area.lon
                    },
                    distance_type:"arc",
                    order:"asc",
                    unit:"mi"
                }
            };
        }

        request.write(JSON.stringify(json));
        request.end();
    }
};
