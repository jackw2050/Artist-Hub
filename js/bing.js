




var myFirebaseRef = new Firebase("https://blistering-heat-4580.firebaseio.com/"),
    usersRef = new Firebase(myFirebaseRef + 'users');

usersRef.on('value', function (snapshot) {
    console.log(snapshot.val());


})
var userKey = 

function GetNews(bandSelected) {
    var params = {
        // Request parameters
        "q": bandSelected,
        "count": "10",
        "offset": "0",
        "mkt": "en-us",
        "&Options": "EnableHighlighting",
        "&News.Offset": "0",
        "safesearch": "Moderate",
    };

    $.ajax({
            url: "https://bingapis.azure-api.net/api/v5/search/?" + $.param(params),
            beforeSend: function(xhrObj) {
                // Request headers
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "9dd9941d21e24c4d921bf0532dced130");
            },
            type: "GET",
            // Request body
            data: "{body}",
        })
        .done(function(data) {
            $(".newsStory").empty();
            for (let i = 0; i < 5; i++) { // check number of stories returned
                $(".newsStory").append("<p>" + data.news.value[i].name);
                $(".newsStory").append("<a class='newsLink' href='" + data.webPages.value[i].url + "'>" + "Full Story");
            }
            console.log(data);
            // alert("success");
        })
        .fail(function() {
            alert("error");
        });
}

function GetConcertInfo(bandSelected) {
    new BIT.Widget({
        "artist": bandSelected,
        "div_id": "tour-dates",
        "force_narrow_layout": "true",
        "display_limit": "5",
        "text_color": "#FFFFFF",
        "bg_color": "#003459",
        "width": "265px",
        "notify_me": "true"
    }).insert_events();
}

function myfunction() {
    var queryURL = "http://api.bandsintown.com/artists/" + artist + ".json?app_id=YOUR_APP_ID&api_version=2.0&callback=showArtist";

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).done(function(response) {
        console.log(response);
    });

}


function readFirebase() {
    myFirebaseRef.on("child_added", function(childSnapshot, prevChildKey) {

        console.log(childSnapshot.val());
        //$("songLinks").append("<a href='https://youtu.be/ltMNupXjZwk'>吉田朱里 渡辺美優紀 上西恵 「ジッパー</a>);

        //https://www.youtube.com/playlist?list=PL8A1ABD0F21899CD5

    });
}
