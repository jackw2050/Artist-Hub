
var myFirebaseRef = new Firebase("https://blistering-heat-4580.firebaseio.com/");

// Retrieve new posts as they are added to our database
myFirebaseRef.on("value", function(snapshot, prevChildKey) {
  var newPost = snapshot.val();
  console.log("Author: " + newPost.name);
  console.log("Title: " + newPost.email);
  console.log("Previous Post ID: " + prevChildKey);
});


//var ref = new Firebase("https://<YOUR-FIREBASE-APP>.firebaseio.com");
function AuthorizeUser(){
myFirebaseRef.authWithPassword({
  email    : "bobtony@firebase.com",
  password : "correcthorsebatterystaple"
}, function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Authenticated successfully with payload:", authData);
  }
});
}


function SetupUserAccount(){
    myFirebaseRef.createUser({
  email    : "bobtony@firebase.com",
  password : "correcthorsebatterystaple"
}, function(error, userData) {
  if (error) {
    console.log("Error creating user:", error);
  } else {
    console.log("Successfully created user account with uid:", userData.uid);
  }
});
}







function GetNews(bandSelected) {
    console.log(bandSelected);
    bandSelected = bandSelected.replace(/ /g,"+");
    bandSelected = bandSelected.replace(/-/g,"+");
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
            console.log(data);
            $(".newsStory").empty();
            for (let i = 0; i < 5; i++) { // check number of stories returned
                var news = $('<div>').attr('class', 'news');

                var pOne = $('<p>').text(data.news.value[i].name).css('font-weight', 'bold');
                news.append(pOne);

                var pTwo = $('<p>').html(data.news.value[i].description + ' <a class="newsLink" target="_blank" href="' + data.news.value[i].url + '">[full story]</a>');
                news.append(pTwo);

                var pThree = $('<hr>')
                news.append(pThree);

                $('.newsStory').append(news);
            }
            //console.log(data);
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
        "text_color": "#616161",
        "bg_color": "#00171F",
        "width": "409px",
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
