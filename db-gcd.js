module.exports = {
    getDetails:function(id,callback){
        // TODO: this
        callback({});
    },
    query:function(qo,callback){
        var query=qo.query,area=qo.area;
        
        let page=1; //for now
        http.get({
            path:"/api/_search/"+encodeURIComponent(query)+"/"+page,
            hostname:"devsalute-001-site4.etempurl.com",
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
                    console.error('GCD error: '+err);
                    callback({});
                }
            });
        });
    }
};
