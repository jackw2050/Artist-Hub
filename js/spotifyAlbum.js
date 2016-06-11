function album(item) {
      //using Spotify API to grab the artist we want information from. 
      url = "https://api.spotify.com/v1/search?q=" + item.toString() + "&type=artist";
      $.getJSON(url, function (json) {
        console.log(json.artists);
        //Grab the second item in the images array which is a smaller image
        var albumImages = json.artists.items[0].images[0].url;
        var artistPopularity = json.artists.items[0].popularity;
        console.log(artistPopularity);
        //Change the HTML to the image from albumImages
        $('#middleColumn').html("<img id='imageStyle' src=" + albumImages + " class='responsive-img'>");
        //This feature will make it so that the popularity of the arist determines
        //the color of the glow around their album art. Red is HOT, yellow is in the middle, and blue is ice COLD.
        if(artistPopularity >= 1 && artistPopularity <= 20) {
          $('#imageStyle').css("box-shadow", "5px 5px 10px #72aee3");
        } else if(artistPopularity >= 21 && artistPopularity <= 39) {
          $('#imageStyle').css("box-shadow", "5px 5px 10px #c9e0f4");
        } else if(artistPopularity >= 40 && artistPopularity <= 60) {
          $('#imageStyle').css("box-shadow", "5px 5px 10px #fcd800");
        } else if(artistPopularity >= 61 && artistPopularity <= 79) {
          $('#imageStyle').css("box-shadow", "5px 5px 10px #fca210");
        } else {
          $('#imageStyle').css("box-shadow", "5px 5px 10px red");
        }
      });
  }
  $(document).on("click", "#addInput", function() {
    //This grabs the html value from userInputText and stores it in a variable.
    var whatIsTyped = $('#userInputText').val();
    //We pull the same variable defined above and run it as the "item" from the function album.
    album(whatIsTyped);
  });