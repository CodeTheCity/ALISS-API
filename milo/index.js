const http=require('http'),https=require('https');
const fs=require('fs');

https.get({
	path:"/web-content/milo-organisation/_search?q=cancer",
	hostname:"50896fdf5c15388f8976945e5582a856.eu-west-1.aws.found.io",
	method:"GET",
	headers:{
		'Authorization':"Basic cmVhZG9ubHk6b25seXJlYWQ="
	}
},function(res){
	console.log('Status '+res.statusCode);
	console.log('Headers '+JSON.stringify(res.headers));
	let data='';
	res.on('data',function(chunk){
		data+=chunk;
	});
	res.on('end',function(){
		fs.writeFileSync('response.json',data);
	});
});
