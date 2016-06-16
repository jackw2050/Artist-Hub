

function WD(item) {
    url = "https://en.wikipedia.org/w/api.php?action=query&prop=description&titles=" + item.toString() + "&prop=extracts&exintro&explaintext&format=json&redirects&callback=?";
    $.getJSON(url, function(json) {
        var item_id = Object.keys(json.query.pages)[0];
        userGiven = json.query.pages[item_id].extract;
        result = "<b></b> <t>" + item + "</t> <b> : </b>" + userGiven;
        $('#wikipediaObject').append("<div class='wikipediaText'>" + userGiven + "</div>");
    });
}
// function checkValue(whatIsTyped)
// {
// 	re = ^.{2,}$;
// 	if(whatIsTyped != '' && !whatIsTyped.match(re)) {
// 		alert("You must enter a valid value");
// 		$('#userInputText').focus();
// 		return false;
// 	}
// 	return true;
// };
$(document).on("click", "#addInput", function() {
    $('#wikipediaObject').html('');
    $('.video').empty();
    var whatIsTyped = $('#userInputText').val();
    // checkValue(whatIsTyped);
    WD(whatIsTyped);
    GetNews(whatIsTyped);
    GetConcertInfo(whatIsTyped);
    searchSongs(whatIsTyped);
    checkSeachExists(whatIsTyped);
    $("#userInputText").val('');
});
