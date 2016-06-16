'use strict';

var myFirebaseRef = new Firebase("https://blistering-heat-4580.firebaseio.com/");
var firebaseUsersRoot = new Firebase("https://blistering-heat-4580.firebaseio.com/users");
var firebaseSearchsRoot = new Firebase("https://blistering-heat-4580.firebaseio.com/searches");
var mySearchArray = [];
var myCountArray = [];
var searchExists = false;



function checkSeachExists(name) {
    if ($.inArray(name, mySearchArray) > -1) {
        var found = $.inArray(name, mySearchArray);
        searchExists = true;
        myCountArray[found]++;
        UpdateSeachItem(mySearchArray[found], myCountArray[found]) 

    } else {
        searchExists = false;
        tryUpdateSearch(name, 1)
    }

    console.log("YYYYY   " + found);

}





firebaseSearchsRoot.on("child_added", function(childSnapshot) {
    // console.log(childSnapshot.val())
    var searchName = childSnapshot.val().name;
    var searchCount = childSnapshot.val().count;
    //  console.log("searchCount " + searchCount);
    console.log("search name " + searchName + "     searchCount " + searchCount);

    mySearchArray.push(searchName);
    myCountArray.push(searchCount);
    //   console.log("Array " + mySearchArray);
    //   console.log("Array " + myCountArray);
});



function UpdateSeachItem(search, counter) {
    let searchData = {
        name: search.toLowerCase(),
        count: counter
    };
    tryUpdateSearch(search, searchData);
}

function tryUpdateSearch(userId, userData) {
    firebaseSearchsRoot.child(userId).transaction(function(currentUserData) {
            return userData;
    }, function(error, committed) {
        searchCreated(userId, committed);
    });
}



function AddSearchItem(search, counter) {
    //   var userId = prompt('Band?', 'Selena Gomez');

    let searchDataNew = {
        name: search.toLowerCase(),
        count: counter
    };
    tryCreateSearch(search, searchDataNew);
}
// Tries to set /users/<userId> to the specified data, but only
// if there's no data there already.
function tryCreateSearch(userId, userData) {
    firebaseSearchsRoot.child(userId).transaction(function(currentUserData) {
        if (currentUserData === null)
            return userData;
    }, function(error, committed) {
        searchCreated(userId, committed);
    });
}

function searchCreated(userId, success) {
    if (!success) {
        alert('user ' + userId + ' already exists!');
    } else {
        alert('Successfully created ' + userId);
    }
}


UpdateTop5();

function UpdateTop5() {

    for(var x = 0; x <5; x++){
      //  $("#list-5").append("<li>" + mySearchArray[x] + "</li>");
            var t5 = $('<li>' + mySearchArray[x]);
         //   t5.append(mySearchArray[x]);
         //   t5.append($('<li>'));
            $("#list-5").append("Test");
            console.log(t5);
    }
    
}




function GetNews(bandSelected) {
    console.log(bandSelected);
    bandSelected = bandSelected.replace(/ /g, "+");
    bandSelected = bandSelected.replace(/-/g, "+");
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
    }).done(function(data) {
        console.log(data);
        $(".newsStory").empty();
        for (let i = 0; i < 5; i++) {
            // check number of stories returned
            
            var news = data.news.value[i].name;
            var news = $('<div>').attr('class', 'news');
            var pOne = $('<p>').text(data.news.value[i].name).css('font-weight', 'bold');//i
            news.append(pOne);
            var pTwo = $('<p>').html(' <a class="newsLink" target="_blank" href="' + data.news.value[i].url + '">[full story]</a>');
         // data.news.value[i].description + 
            news.append(pTwo);
            var pThree = $('<hr>')
            news.append(pThree);
            $('.newsStory').append(news);
        }
        //console.log(data);
        // alert("success");
    }).fail(function() {
        alert("error");
    });
}

function GetConcertInfo(bandSelected) {
    $('#tour-dates').empty();
    new BIT.Widget({
        "artist": bandSelected,
        "div_id": "tour-dates",
        "force_narrow_layout": "true",
        "display_limit": "5",
        "text_color": "#616161",
        "bg_color": "#00171F",
        "width": "300px",
        "notify_me": "true"
    }).insert_events();
}

function myfunction() {
    var queryURL = "https://api.bandsintown.com/artists/" + artist + ".json?app_id=YOUR_APP_ID&api_version=2.0&callback=showArtist";
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).done(function(response) {
        console.log(response);
    });
}
