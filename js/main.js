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
var mySearchArray = [];
var myCountArray = [];
var searchExists = false;
var myArray = [];


function searchSongs(keyword) {
    $('.songLinks').empty();
    keyword = keyword.replace(/ /g, "+");
    console.log(keyword);
    var queryURL = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=' + keyword + '&key=' + ytAPIKey;
    // Creates AJAX call for the specific movie being 
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).done(function(response) {
        var results = response.items;
        console.log(queryURL);
        console.log(response);
        console.log(results);
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
            }
            ;$('.songLinks').append(videoDiv).addClass('mCustomScrollbar').attr('data-mcs-theme', 'dark');
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

function onClick() {
    $('.video').empty();
    var vidId = $(this).attr('id');
    $('.video').html('<iframe width="395" height="315" src="https://www.youtube-nocookie.com/embed/' + vidId + '?rel=0&"&amp;controls=0&autoplay=1&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>');
};


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
        };
        tryUpdateSearch(name, newItem)
    };
};


function UpdateTop5() {// array of objects  name:  ,
console.log(myArray);
    for (var x = 0; x < 5; x++) {
        
            //add code here
    };
};


function SortMyArray() {
    myArray.sort(function(a, b) {
        return parseFloat(a.count) < parseFloat(b.count);
    });
};


//  Update Firebase with new count
function UpdateSeachItem(search, counter) {
    let searchData = {
        name: search.toLowerCase(),
        count: counter
    };
    tryUpdateSearch(search.replace(/ /g, "_"), searchData);
};

//  Privides error function for Firebase data creation
function tryUpdateSearch(userId, userData) {
    firebaseSearchsRoot.child(userId).transaction(function(currentUserData) {
        return userData;
    }, function(error, committed) {
        searchCreated(userId, committed);
    });
};


//  Create new search item in Firebase with count of one.
// This code checks for existance of data name.  Creates new data or returns error if it exists.
// Since this function is only called if the search item is not in the array it should never throw an exception
function AddSearchItem(search, counter) {

    let searchDataNew = {
        name: search.toLowerCase(), // convert name to all lower case to prevent duplicates.  Does not work for mispelling
        count: counter
    };
    tryCreateSearch(search.replace(/ /g, "_"), searchDataNew);
};

// Tries to set /users/<userId> to the specified data, but only
// if there's no data there already.
function tryCreateSearch(userId, userData) {
    firebaseSearchsRoot.child(userId).transaction(function(currentUserData) {
        if (currentUserData === null)
            return userData;
    }, function(error, committed) {
        searchCreated(userId, committed);
    });
};


//  Comment out alerts.  We should add some code here???
function searchCreated(userId, success) {
    if (!success) {
       // alert('user ' + userId + ' already exists!');
    } else {
       // alert('Successfully created ' + userId);
    };
};

function WD(item) {
    var url = "https://en.wikipedia.org/w/api.php?action=query&prop=description&titles=" + item.toString() + "&prop=extracts&exintro&explaintext&format=json&redirects&callback=?";
    $.getJSON(url, function(json) {
        var item_id = Object.keys(json.query.pages)[0];
        var userGiven = json.query.pages[item_id].extract;
        var result = "<b></b> <t>" + item + "</t> <b> : </b>" + userGiven;
        $('#wikipediaObject').append("<div class='wikipediaText'>" + userGiven + "</div>");
    });
};

function checkValue(whatIsTyped) {
    console.log("inside = " + whatIsTyped);
	var re = /^.{2,}$/;
    console.log("re");
	if(whatIsTyped != '' && !whatIsTyped.match(re)) {
        console.log("this is below the regex");
		sweetAlert("Nope...", "You need to enter an artist!", "error");
        $('#rightColumn').html("");
		whatIsTyped.focus();
		return false;
	};
	return true;
};


function album(item) {
    //using Spotify API to grab the artist we want information from. 
    var url = "https://api.spotify.com/v1/search?q=" + item.toString() + "&type=artist";
    $.getJSON(url, function(json) {
        console.log(json.artists);
        var lengthOfArtists = json.artists.total;
        console.log(lengthOfArtists + "This is the total amount of artists");
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
        console.log(artistPopularity);
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

            news.append(pTwo);
            var pThree = $('<hr>')
            news.append(pThree);
            $('.newsStory').append(news);
        };
        //console.log(data);
        // alert("success");
    }).fail(function() {
        sweetAlert("Nope...", "You need to enter an artist!", "error");
        $('#rightColumn').html("");
    });
};

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
};

function myfunction() {
    var queryURL = "https://api.bandsintown.com/artists/" + artist + ".json?app_id=YOUR_APP_ID&api_version=2.0&callback=showArtist";
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).done(function(response) {
        console.log(response);
    });
};


function a2() {
    firebaseSearchsRoot.on("child_added", function(childSnapshot) { // change to order by count
        var searchName = childSnapshot.val().name;
        var searchCount = childSnapshot.val().count;
        //  console.log("searchCount " + searchCount);
        //  console.log("search name " + searchName + "     searchCount " + searchCount);

        var a = {
            name: searchName,
            count: searchCount
        };

        myArray.push(a);
        var b = myArray.sort();

        //mySearchArray.push(searchName);
        //myCountArray.push(searchCount);
        // console.log("Array " + mySearchArray);
        //  console.log("Array " + b);
        // var tests = SortMyArray();
        console.log("inside")
        console.log(myArray);//             array of searches
    }); 
    console.log("outside")  
    console.log(myArray);
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


$( window ).load(function() {
    a2();
    console.log( "window loaded" );
	console.log(myArray);

});