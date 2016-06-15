readFirebase();
SetupUserAccount();
AuthorizeUser();
function WD(item) {
    url = "https://en.wikipedia.org/w/api.php?action=query&prop=description&titles=" + item.toString() + "&prop=extracts&exintro&explaintext&format=json&redirects&callback=?";
    $.getJSON(url, function(json) {
        var item_id = Object.keys(json.query.pages)[0];
        userGiven = json.query.pages[item_id].extract;
        result = "<b></b> <t>" + item + "</t> <b> : </b>" + userGiven;
        $('#wikipediaObject').append("<div class='wikipediaText'>" + userGiven + "</div>");
    });
}
function checkValue(whatIsTyped)
{
    console.log("inside = " + whatIsTyped);
	re = /^.{2,}$/;
    console.log("re");
	if(whatIsTyped != '' && !whatIsTyped.match(re)) {
        console.log("this is below the regex");
		sweetAlert("Nope...", "You need to enter an artist!", "error");
        $('#rightColumn').html("");
		whatIsTyped.focus();
		return false;
	}
	return true;
};
$(document).on("click", "#addInput", function() {
    $('#wikipediaObject').html('');
    $('.video').empty();
    var whatIsTyped = $('#userInputText').val();
    checkValue(whatIsTyped);
    WD(whatIsTyped);
    GetNews(whatIsTyped);
    GetConcertInfo(whatIsTyped);
    searchSongs(whatIsTyped);
    $('#rightColumn').html("<div class='preloader-wrapper big active'><div class='spinner-layer spinner-blue-only'><div class='circle-clipper left'><div class='circle'></div></div><div class='gap-patch'><div class='circle'></div></div><div class='circle-clipper right'><div class='circle'></div></div></div></div>");
    //This grabs the html value from userInputText and stores it in a variable.
    var whatIsTyped = $('#userInputText').val();
    //We pull the same variable defined above and run it as the "item" from the function album.
    album(whatIsTyped);
    $("#userInputText").val('');
});
