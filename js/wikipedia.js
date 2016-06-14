
	function WD(item) {
	    url = "http://en.wikipedia.org/w/api.php?action=query&prop=description&titles=" + item.toString() + "&prop=extracts&exintro&explaintext&format=json&redirects&callback=?";
	    $.getJSON(url, function (json) {
	        var item_id = Object.keys(json.query.pages)[0];
	        userGiven = json.query.pages[item_id].extract;
	        result = "<b></b> <t>" + item + "</t> <b> : </b>" + userGiven;
	        $('#wikipediaObject').append("<div class='wikipediaText'>"+result+"</div>");
	    });
	}
	$(document).on("click", "#addInput", function() {
		$('#wikipediaObject').html('');
		var whatIsTyped = $('#userInputText').val();
		WD(whatIsTyped);
		GetNews(whatIsTyped);
		GetConcertInfo(whatIsTyped);
		
	});