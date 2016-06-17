'use strict';

var myFirebaseRef = new Firebase("https://blistering-heat-4580.firebaseio.com/");
var firebaseUsersRoot = new Firebase("https://blistering-heat-4580.firebaseio.com/users");
var firebaseSearchsRoot = new Firebase("https://blistering-heat-4580.firebaseio.com/searches");
var mySearchArray = [];
var myCountArray = [];
var searchExists = false;
var myArray = [];



// Search array to verify if search for band/ artist already exists.
// If it exists increment counter and write to Firebase.
// Else create new search in Firebase with count of 1
function checkSeachExists(name) {
    if ($.inArray(name, mySearchArray) > -1) {
        var found = $.inArray(name, mySearchArray);
        searchExists = true;
        myCountArray[found]++;
        UpdateSeachItem(mySearchArray[found], myCountArray[found])
    } else {
        searchExists = false;
        var newItem = {
            name: name,
            count: 1
        }
        tryUpdateSearch(name, newItem)
    }
}


function a2() {
    firebaseSearchsRoot.on("child_added", function(childSnapshot) { // change to order by count
        var searchName = childSnapshot.val().name;
        var searchCount = childSnapshot.val().count;
        //  console.log("searchCount " + searchCount);
        //  console.log("search name " + searchName + "     searchCount " + searchCount);

        var a = {
            name: searchName,
            count: searchCount
        }

        myArray.push(a);
        var b = myArray.sort();

        //mySearchArray.push(searchName);
        //myCountArray.push(searchCount);
        // console.log("Array " + mySearchArray);
        //  console.log("Array " + b);
        // var tests = SortMyArray();
        console.log(myArray);//             array of searches
    });


   
}


function UpdateTop5() {// array of objects  name:  ,
console.log(myArray);
    for (var x = 0; x < 5; x++) {
        
            //add code here


    }
 
}




function SortMyArray() {
    myArray.sort(function(a, b) {
        return parseFloat(a.count) < parseFloat(b.count);
    });
}


//  Update Firebase with new count
function UpdateSeachItem(search, counter) {
    let searchData = {
        name: search.toLowerCase(),
        count: counter
    };
    tryUpdateSearch(search.replace(/ /g, "_"), searchData);
}
//  Privides error function for Firebase data creation
function tryUpdateSearch(userId, userData) {
    firebaseSearchsRoot.child(userId).transaction(function(currentUserData) {
        return userData;
    }, function(error, committed) {
        searchCreated(userId, committed);
    });
}


//  Create new search item in Firebase with count of one.
// This code checks for existance of data name.  Creates new data or returns error if it exists.
// Since this function is only called if the search item is not in the array it should never throw an exception
function AddSearchItem(search, counter) {

    let searchDataNew = {
        name: search.toLowerCase(), // convert name to all lower case to prevent duplicates.  Does not work for mispelling
        count: counter
    };
    tryCreateSearch(search.replace(/ /g, "_"), searchDataNew);
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


//  Comment out alerts.  We should add some code here???
function searchCreated(userId, success) {
    if (!success) {
       // alert('user ' + userId + ' already exists!');
    } else {
       // alert('Successfully created ' + userId);
    }
}









//-----------------------------------------   News Section --------------------------------------------------
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
            console.log("news " + news);
            var news = $('<div>').attr('class', 'news');
            var pOne = $('<p>').text(data.news.value[i].name).css('font-weight', 'bold'); //i
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
// ------------------------------------------- Concert Info Section --------------------------------------
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
