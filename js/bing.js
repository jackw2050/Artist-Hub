var myFirebaseRef = new Firebase("https://blistering-heat-4580.firebaseio.com/");
var firebaseUsersRoot = new Firebase("https://blistering-heat-4580.firebaseio.com/users");
var firebaseSearchsRoot = new Firebase("https://blistering-heat-4580.firebaseio.com/searches");

//readFirebase() ;
//SetupUserAccount();
//AuthorizeUser();
//AddNewUser();
//AddNewSearch();

firebaseUsersRoot.orderByValue().on("value", function(snapshot) {
    snapshot.forEach(function(data) {
        // console.log("User key " + data.key() + " user's name is " + data.val().name);
        // console.log("User key " + data.key() + " user's user name is " + data.val().username);
        // console.log("User key " + data.key() + " user's user name is " + data.val().searches);
    });
});

firebaseSearchsRoot.orderByValue().on("value", function(snapshot) {
    snapshot.forEach(function(data) {

        console.log("Search name " + snapshot.val());

    });
});



function readFirebase() {}
firebaseSearchsRoot.on("child_added", function(childSnapshot, prevChildKey) {

    searchName = childSnapshot.val().search;
    searchResult = childSnapshot.val().result;
    console.log("Search: " + searchName);
    console.log("Play list: " + searchResult);
    //  console.log("<a href=https://www.youtube.com/playlist?list=" + searchResult + ">" + searchName + "</a>")
    $(".card-action").append("<a href='https://www.youtube.com/playlist?list=" + searchResult + ">" + searchName + "</a>");
});


function AddNewUser() {

    // Grabs user input
    let Name = "John Doe"
    let userName = "john-doe";
    let email = "jdoe@yahoo.com";


    var newUser = {
        Name: Name,
        userName: userName,
        email: email
    }

    myFirebaseRef.push(newUser);
    //  console.log(newUser);
    alert("New user added");
};

function AddNewSearch() {

    // Grabs user input
    let search = "Black Sabbath";
    let result = "PLAb2lmNIYk_4Th0u7UtSg75g29gqzi4K1";
    var newSearch = {
        search: search,
        result: result
    }

    firebaseSearchsRoot.push(newSearch);
    //   console.log(search);
    alert("New search added");
};




function AuthorizeUser() {
    myFirebaseRef.authWithPassword({
        email: "bobtony@firebase.com",
        password: "correcthorsebatterystaple"
    }, function(error, authData) {
        if (error) {
            console.log("Login Failed!", error);//  call alert here
        } else {
            console.log("Authenticated successfully with payload:", authData);
        }
    });
}


function SetupUserAccount() {
    myFirebaseRef.createUser({
        email: "bobtony@firebase.com",
        password: "correcthorsebatterystaple"
    }, function(error, userData) {
        if (error) {
            console.log("Error creating user:", error);
        } else {
            console.log("Successfully created user account with uid:", userData.uid);
        }
    });
}

function ResetPassword() {
    myFirebaseRef.resetPassword({
        email: "bobtony@firebase.com"
    }, function(error) {
        if (error === null) {
            console.log("Password reset email sent successfully");
        } else {
            console.log("Error sending password reset email:", error);
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
