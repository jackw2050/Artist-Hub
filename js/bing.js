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

                //$(".newsStory").append("<img src='" + data.news.value[i].image.thumbnail.contentUrl + "'>");
                $(".newsStory").append("<p>" + data.news.value[i].name);
                //$(".card-action").append("<a href='" + data.webPages.value[i].url + "'>Full Story</a>");
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
        "artist":"Selena Gomez", 
        "div_id":"tour-dates",
        "force_narrow_layout": "true",
        "display_limit": "5",
        "bg_color": "#FFFFFF"
      }).insert_events();
}

/*    $("#show-widget").click(function() { 
      new BIT.Widget({ 
        "artist":"Selena Gomez", 
        "div_id":"tour-dates",
        "force_narrow_layout": "true",
        "display_limit": "5",
        "bg_color": "#FFFFFF"
      }).insert_events();
    });
*/
//http://api.bandsintown.com/artists/Crystal%20Castles.json?app_id=YOUR_APP_ID&api_version=2.0&callback=showArtist


    var params2 = {
        // Request parameters
        "q": "selena gomez"
 
    };
    $.ajax({
            url: "http://api.bandsintown.com/artists/selena gomez.json?app_id=YOUR_APP_ID&api_version=2.0&callback=showArtist"  ,
            beforeSend: function(xhrObj) {
                // Request headers
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "9dd9941d21e24c4d921bf0532dced130");
            },
            type: "GET",
            // Request body
            data: "{body}",
        })
        .done(function(data) {
           
            console.log(data);
            // alert("success");
        })
        .fail(function() {
            alert("error");
        });