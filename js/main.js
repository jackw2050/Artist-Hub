'use strict';

var ytAPIKey = "AIzaSyDIQB1GaunklYrD3IYiI5h_J2bTDTR8NgY";
var keyword = '';
var videoArray = [];
var allVideoArray = [];
var channelIdArray = [];
var playlistIdArray = [];
var myFirebaseRef = new Firebase("https://blistering-heat-4580.firebaseio.com/");
var firebaseUsersRoot = new Firebase("https://blistering-heat-4580.firebaseio.com/users");
var firebaseSearchsRoot = new Firebase("https://blistering-heat-4580.firebaseio.com/searches");
var dbLocation = 'https://blistering-heat-4580.firebaseio.com/';
var mySearchArray = [];
var myCountArray = [];
var searchExists = false;
var myArray = [];
var firebaseObjectArray = [];

function a2() {
    console.log("a2");
    myArray = [];
    let ii = 0;
    firebaseSearchsRoot.on("child_added", function(childSnapshot) { // change to order by count
        ii++;
        firebaseObjectArray.push(childSnapshot.val());
        var searchName = childSnapshot.val().name;
        var searchCount = childSnapshot.val().count;
        var a = {
            name: searchName,
            count: searchCount
        };
        myArray.push(a);
        mySearchArray.push(searchName);
        myCountArray.push(searchCount);
    });;
    setTimeout(sortMyArray, 3000);
    setTimeout(updateTop5, 3100);
};

function sortMyArray() {
    console.log("sortMyArray");
    myArray.sort(function(a, b) {
        return parseFloat(a.count) < parseFloat(b.count);
    });
};

function updateTop5() { // array of objects  name:  ,
     console.log("updateTop5");
     // console.log(myArray);

    for (var x = 0; x < 5; x++) {
        var y = x+1;
        // console.log(y);
        var newName = toTitleCase(myArray[x].name);
        // console.log(newName);
        $('#top'+y).html('<a style="text-transform:none">  ' + newName + '</a>').attr('data-name', newName).on('click', searchAgain).css({
                    'margin-top': '10px',
                    'margin-bottom': '1px',
                    'cursor': 'pointer',
                    'font-size': '14px'
                });
    };
};

function toTitleCase(str) {
    console.log("toTitleCase");
        str = str.replace(/_/g, " ");
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

function checkValue(whatIsTyped) {
    console.log("checkValue");
    // console.log("inside = " + whatIsTyped);

    var re = /^.{2,}$/;
    // console.log("re");
    if (whatIsTyped != '' && !whatIsTyped.match(re)) {
        // console.log("this is below the regex");
        sweetAlert("Nope...", "You need to enter an artist!", "error");
        $('#rightColumn').html("");
        whatIsTyped.focus();
        return false;
    };
    return true;
};

function checkIfSearchExists(search) {
    console.log("checkIfSearchExists");
// The ideantifier in the collection.
    var searchTerm = search.toLowerCase().replace(/ /g, "_");
    var camelCaseTerm = toTitleCase(search);
    // console.log("Search Term: " + searchTerm);
    // console.log("Camel case term: " + camelCaseTerm);
// the data for the object being created/updated.
    var searchSet = {
        name: camelCaseTerm,
        count: 1
    };
// attempt to get the child in the collection by uid.
    firebaseSearchsRoot.child(searchTerm).once('value', function(snapshot) {
        // console.log(snapshot);
        // console.log(snapshot.val());
        // if data exists
        if (snapshot.exists()) {
            var firebaseSearchTerm = new Firebase("https://blistering-heat-4580.firebaseio.com/searches/" + searchTerm);
            // get the ref (in this case /users/2) and update its contents
            firebaseSearchTerm.child('count').once('value', function(howMany) {
                // console.log(howMany);
                // console.log(howMany.val());
                var searchCount = howMany.val();
                searchCount = searchCount + 1;
                // console.log("search count: " + searchCount);
                var updateCount = {
                    count: searchCount
                };
                snapshot.ref().update(updateCount);
            });
        } else {
            tryUpdateSearch(searchTerm, searchSet);
        };
    });
};

//  Privides error function for Firebase data creation
function tryUpdateSearch(searchTerm, userData) {
    console.log("tryUpdateSearch");
    firebaseSearchsRoot.child(searchTerm).transaction(function(currentUserData) {
        return userData;
    }, function(error, committed) {
      //  searchCreated(userId, committed);
    });
};

function WD(item) {
    console.log("WD");
    item = item.replace(/ /g, "+");
    var url = "https://en.wikipedia.org/w/api.php?action=query&prop=description&titles=" + item.toString() + "&prop=extracts&exintro&explaintext&format=json&redirects&callback=?";
    $.getJSON(url, function(json) {
        var item_id = Object.keys(json.query.pages)[0];
        var userGiven = json.query.pages[item_id].extract;
        var result = "<b></b> <t>" + item + "</t> <b> : </b>" + userGiven;
        $('#wikipediaObject').append("<div class='wikipediaText'>" + userGiven + "</div>");
    });
};

function getNews(bandSelected) {
    console.log("getNews");
    // console.log(bandSelected);
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
    }).done(function(newsData) {
        $(".newsStory").empty();
        for (let i = 0; i < 5; i++) {
            var news = newsData.news.value[i].name;
            // console.log("news " + news);
            var news = $('<div>').attr('class', 'news');
            var pOne = $('<p>').text(newsData.news.value[i].name).css('font-weight', 'bold'); //i
            news.append(pOne);
            var pTwo = $('<p>').html(newsData.news.value[i].description + ' ...<a class="newsLink" target="_blank" href="' + newsData.news.value[i].url + '">[full story]</a>');

            news.append(pTwo);
            var pThree = $('<hr>')
            news.append(pThree);
            $('.newsStory').append(news);
        };
    }).fail(function() {
        sweetAlert("Nope...", "You need to enter an artist!", "error");
        $('#rightColumn').html("");
    });
};

function getConcertInfo(bandSelected) {
    console.log("getConcertInfo");
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
};

function searchSongs(keyword) {
    console.log("searchSongs");
    $('.songLinks').empty();
    keyword = keyword.replace(/ /g, "+");
    // console.log(keyword);
    var queryURL = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=' + keyword + '&key=' + ytAPIKey;
    // Creates AJAX call for the specific movie being 
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).done(function(response) {
        var results = response.items;
        // console.log(queryURL);
        // console.log(response);
        // console.log(results);
        Object.keys(results).forEach(function(key, index) {
            videoArray = [];
            var num = parseInt(key) + 1;
            var videoDiv = $('<div>');
            if (results[key].id.videoId) {
                var title = results[key].snippet.title;
                var videoId = results[key].id.videoId;
                videoArray.push(title);
                var pOne = $('<p>').html('<i class="tiny material-icons">play_circle_outline</i><a style="text-transform:none">  ' + title + '</a>').css({
                    'font-size': '12px',
                    'margin-top': '10px',
                    'margin-bottom': '1px',
                    'cursor': 'pointer'
                });
                pOne.attr('id', videoId);
                pOne.on('click', onClick);
                videoDiv.append(pOne);
            } else {
                var title = results[key].snippet.title;
                videoArray.push(title);
                var pOne = $('<p>').text(title).css({
                    'font-size': '10px',
                    'margin-top': '10px',
                    'margin-bottom': '1px'
                });
                //videoDiv.append(pOne);
            }
            var image = results[key].snippet.thumbnails.default.url;
            videoArray.push(image);
            var pTwo = $('<p>').text("Image: " + image).css('margin', '1px');
            //videoDiv.append(pTwo);
            var thumbnail = $('<img>');
            thumbnail.attr('id', 'thumbnails');
            thumbnail.attr('src', results[key].snippet.thumbnails.default.url);
            //videoDiv.append(thumbnail);
            if (results[key].id.videoId) {
                //console.log("videoID");
                var videoId = results[key].id.videoId;
                videoArray.push(videoId);
                var pThree = $('<p>').text("VideoId: " + videoId).css('margin', '1px');
                //videoDiv.append(pThree);
                // var link = $('<button>');
                // link.attr('id', videoId);
                // link.attr('status', 'closed');
                // link.on('click',onClick);
                // link.html("Play Video").css('font-weight', 'bold');
                //link.html('<a href="https://www.youtube.com/watch?v=' + videoId + '" target="_blank">Play Video</a>');
                //link.html('<iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe>');
                // videoDiv.append(link);
            } else if (results[key].id.channelId) {
                //console.log("channelId");
                var channelId = results[key].id.channelId;
                videoArray.push(channelId);
                channelIdArray.push(channelId);
                //var pThree = $('<p>').text("ChannelId: " + channelId).css({'margin':'1px','background-color':'yellow', 'width':'400px'});
                //videoDiv.append(pThree);
            } else {
                //console.log("playlistId");
                var playlistId = results[key].id.playlistId;
                videoArray.push(playlistId);
                playlistIdArray.push(playlistId);
                //var pThree = $('<p>').text("PlaylistId: " + playlistId).css({'margin':'1px','background-color':'yellow', 'width':'400px'});
                //videoDiv.append(pThree);

            };
            $('.songLinks').append(videoDiv).addClass('mCustomScrollbar').attr('data-mcs-theme', 'dark');

            //console.log(videoArray);
            allVideoArray.push(videoArray);
        });
        var instructions = $('<h5>');
        instructions.css({
            color: '#000'
        });
        instructions.text('Click a video title below and enjoy!');
        $('.video').append(instructions);
        // var picture = $('<img>');
        // picture.attr('src', results[0].snippet.thumbnails.medium.url);
        // $('.video').append(picture);
        return false;
    });
};

function album(item) {
    console.log("album");
    //using Spotify API to grab the artist we want information from. 
    var url = "https://api.spotify.com/v1/search?q=" + item.toString() + "&type=artist";
    $.getJSON(url, function(json) {
        // console.log(json.artists);
        var lengthOfArtists = json.artists.total;
        // console.log(lengthOfArtists + "This is the total amount of artists");
        if (lengthOfArtists > 1) {
            //Grab the second item in the images array which is a smaller image
            var albumImages = json.artists.items[0].images[0].url;
            var artistPopularity = json.artists.items[0].popularity;
            //Change the HTML to the image from albumImages
            $('#rightColumn').html("<img id='imageStyle' src=" + albumImages + " class='responsive-img'>");
        };
        // var picture = $('<img>');
        //   picture.attr('src', json.artists.items[1].images[1].url).css('width', '400');
        //   $('.video').append(picture);
        if (lengthOfArtists == 0) {
            swal({
                title: "Dangit!",
                text: "We could not find an artists with that name!",
                imageUrl: "images/sadface.png"
            });
            $('#rightColumn').html("");
        };
        // console.log(artistPopularity);
        //$('rightColumn').prepend("Hotness rating: " + artistPopularity);
        //This feature will make it so that the popularity of the arist determines
        //the color of the glow around their album art. Red is HOT, yellow is in the right, and blue is ice COLD.
        if (artistPopularity >= 1 && artistPopularity <= 20) {
            $('#imageStyle').css("box-shadow", "5px 5px 10px #72aee3");
        } else if (artistPopularity >= 21 && artistPopularity <= 39) {
            $('#imageStyle').css("box-shadow", "5px 5px 10px #c9e0f4");
        } else if (artistPopularity >= 40 && artistPopularity <= 60) {
            $('#imageStyle').css("box-shadow", "5px 5px 10px #fcd800");
        } else if (artistPopularity >= 61 && artistPopularity <= 79) {
            $('#imageStyle').css("box-shadow", "5px 5px 10px #fca210");
        } else {
            $('#imageStyle').css("box-shadow", "5px 5px 10px red");
        };
    });
};

// function searchCreated(userId, success) {
//     console.log("searchCreated");
//     if (!success) {
//         // alert('user ' + userId + ' already exists!');
//     } else {
//         //alert('Successfully created ' + userId);
//     };
// };

function onClick() {
    console.log("onClick");
    $('.video').empty();
    var vidId = $(this).attr('id');
    $('.video').html('<iframe width="395" height="315" src="https://www.youtube-nocookie.com/embed/' + vidId + '?rel=0&"&amp;controls=0&autoplay=1&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>');
};

function searchAgain() {
    console.log("searchAgain");
    var nameID = $(this).attr('data-name');
    console.log(nameID);
    $('#wikipediaObject').html('');
    $('.video').empty();
    checkIfSearchExists(nameID);
    a2();
    WD(nameID);
    getNews(nameID);
    getConcertInfo(nameID);
    searchSongs(nameID);
    $('#rightColumn').html("<div class='preloader-wrapper big active'><div class='spinner-layer spinner-blue-only'><div class='circle-clipper left'><div class='circle'></div></div><div class='gap-patch'><div class='circle'></div></div><div class='circle-clipper right'><div class='circle'></div></div></div></div>");
    album(nameID);
};

$(document).on("click", "#addInput", function() {
    console.log("document on click");
    $('#wikipediaObject').html('');
    $('.video').empty();
    var whatIsTyped = $('#userInputText').val().trim();
    checkValue(whatIsTyped);
    checkIfSearchExists(whatIsTyped);
    a2();
    WD(whatIsTyped);
    getNews(whatIsTyped);
    getConcertInfo(whatIsTyped);
    searchSongs(whatIsTyped);
    $('#rightColumn').html("<div class='preloader-wrapper big active'><div class='spinner-layer spinner-blue-only'><div class='circle-clipper left'><div class='circle'></div></div><div class='gap-patch'><div class='circle'></div></div><div class='circle-clipper right'><div class='circle'></div></div></div></div>");
    album(whatIsTyped);
    $("#userInputText").val('');
});



// $(window).load(function() {
//     console.log("window on load");
//     // console.log( "window loaded" );
//     // console.log(myArray);

// });

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++   THE FUNCTIONS BELOW HERE ARE NEVER CALLED  ???  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 
// 
//  Create new search item in Firebase with count of one.
// This code checks for existance of data name.  Creates new data or returns error if it exists.
// Since this function is only called if the search item is not in the array it should never throw an exception
// function addSearchItem(search, counter) {
//     // console.log("addSearchItem");
//     var searchTerm = search.toLowerCase().replace(/ /g, "_");
//     let searchDataNew = {
//         name: searchTerm, // convert name to all lower case to prevent duplicates.  Does not work for mispelling
//         count: counter
//     };
//     tryCreateSearch(searchTerm, searchDataNew);
// };

// // Tries to set /users/<userId> to the specified data, but only
// // if there's no data there already.
// function tryCreateSearch(userId, userData) {
//     // console.log("tryCreateSearch");
//     firebaseSearchsRoot.child(userId).transaction(function(currentUserData) {
//         if (currentUserData === null)
//             return userData;
//     }, function(error, committed) {
//        // searchCreated(userId, committed);
//     });
// };

// function myFunction() {
//     // console.log("myFunction");
//     var queryURL = "https://api.bandsintown.com/artists/" + artist + ".json?app_id=YOUR_APP_ID&api_version=2.0&callback=showArtist";
//     $.ajax({
//         url: queryURL,
//         method: 'GET'
//     }).done(function(response) {
//         // console.log(response);
//     });
// };
// //"child_added"
// //
// // //  Update Firebase with new count
// function updateSeachItem(search, counter) {
//     // console.log("updateSeachItem");
//     var camelCaseTerm = toTitleCase(search);
//     var searchTerm = search.toLowerCase().replace(/ /g, "_");
//     let searchData = {
//         name: camelCaseTerm,
//         count: counter
//     };
//     tryUpdateSearch(searchTerm, searchData);
// };

