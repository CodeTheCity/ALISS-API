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
        $.get(URLin, function(data) {
console.log('get data');
console.log(data);
          aggResults = data;
          //extract information and make available to UI
	  formatResults(aggResults);

        });


			break;

			case "urllink":

				var buildurl = $(idclick).attr('href');
				window.open(buildurl);

			break;

		}

	});
  function formatResults(aggResults) {
console.log('function called');
    var resultsUI = '';
    var count = 0;
      resultsUI += '<section id="linked-results">';
      var topItem = aggResults.shift();
      aggResults.forEach(function(extractItems) {
 //console.log(extractItems);
      count++;

         
      var itemsDiv = "count-" + count;
      resultsUI += '<div class="resultsItem" id="' + itemsDiv + '">';
      resultsUI += '<div class="resultsTitle">' + extractItems.title + '</div>';
      resultsUI += '<div class="resultsDesc">';
      resultsUI += '<div>' + extractItems.description;
      resultsUI += '</div>';
      resultsUI += '</div>';
      
      resultsUI += '<div id="location">';
  
      var locationInfo = extractItems.locations;

      var location2 = locationInfo[0];            
      locationInfo.forEach(function(extractLocation) {
            if(extractLocation.address) {
                 resultsUI += '<div>' + extractLocation.address + '</div>';
                 }
            if(extractLocation.postcode) {
                 resultsUI += '<div>' + extractLocation.postcode + '</div>';
                 }
    });
 

      resultsUI += '</div>';
      resultsUI += '</div>';
 
      });

      resultsUI += '</section>';
      $("#results").show();
      //console.log(resultsUI);
      $("#results").html(resultsUI);
      

      
      var resultTop = '';
      
      resultTop += '<div class="resultTop">';
      resultTop += '<div class="resultsTitle">' + topItem.title + '</div>';
      resultTop += '<div class="resultsDesc">';
      resultTop +=  topItem.description;
      resultTop += '</div>';
       
      
      var locationInfo = topItem.locations;

      var location2 = locationInfo[0];            
      locationInfo.forEach(function(extractLocation) {
            if(extractLocation.address) {
                 resultTop += '<div>' + extractLocation.address + '</div>';
                 }
            if(extractLocation.postcode) {
                 resultTop += '<div>' + extractLocation.postcode + '</div>';
                 }
    });
      resultTop += '</div>';

      $("#topResult").html(resultTop);
  };

});  // closes Jquery
