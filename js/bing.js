$(function() {
    var params = {
        // Request parameters
        "q": "elvis presley",
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

            for (let i = 0; i < 1; i++) {

                //$(".newsStory").append("<img src='" + data.news.value[i].image.thumbnail.contentUrl + "'>");
                //$(".newsStory").append("<p>" + data.news.value[i].description);
                $(".card-action").append("<a href='" + data.webPages.value[i].url + "'>Full Story</a>");
                //$("#Story").append("<a href='" + data.webPages.value[i].url + "'>" + data.webPages.value[i].name );

            }


            console.log(data);
            // alert("success");
        })
        .fail(function() {
            alert("error");
        });


});

$(function() {


            let dataArtist          = "The clash";
            let dataTextColor       = "#FFFFFF";
            let dataLinkColor       = "#FFFFFF";
            let dataBgColor         = "#000000";
            let dataSeparatorColor  = "#E9E9E9";
            let dataWidth           = "100%";// can be % or px
            let dataDisplayLimit    = "5";




 $(".newsStory").append("<a href='http://www.bandsintown.com' class='bit-widget-initializer' dataDisplayLimit='" + dataDisplayLimit + "' data-artist='" + dataArtist +"''>Bandsintown</a>");




            });




/*
        <div class="col s4 m4 offset-m4 offset-s4 newsStory">
         <!--<a href="http://www.bandsintown.com" class="bit-widget-initializer" data-artist="Selena Gomez">Bandsintown</a>-->

        </div>
*/

