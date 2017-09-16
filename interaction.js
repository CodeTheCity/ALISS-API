/**
*  jQuery listen for clicks and interaction
*
*/
$(document).ready(function(){
console.log('jquery live???');
	LinkAPI = {};
	LinkAPI.cloudIP = "http://localhost:8822";
	LinkAPI.localIP = "http://localhost:8822";
	LinkAPI.aggregator = "http://codethecity-aggregator-api.azurewebsites.net/search?q=";
	LinkAPI.map = "http://www.google.com/maps";

	$("a").click(function(e) {
		e.preventDefault(e);
		var idclick = $(this).attr("id");
console.log(idclick);

		switch(idclick){

			case "isolation":
        // make aggretor get call
        var aggResults;
        var URLin = LinkAPI.aggregator + idclick;
console.log(URLin);
        var data;
        $.get("https://www.aliss.org/api/v2/search/?q=", function(data) {
console.log('get data');
console.log(data);
          aggResults = data;
        // extract the information and make available to UI
//console.log(aggResults);
        //dataExtractionCondition(liveALISSresults);

        });


			break;

			case "urllink":

				var buildurl = $(idclick).attr('href');
				window.open(buildurl);

			break;

		}

	});


});  // closes Jquery
