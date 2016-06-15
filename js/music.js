// $(document).ready(function(){
	var ytAPIKey = "AIzaSyDIQB1GaunklYrD3IYiI5h_J2bTDTR8NgY";
	// gapi.client.setApiKey(ytAPIKey);
	// gapi.client.load('youtube', 'v3').then(function() { console.log('loaded.'); });
	var keyword = '';
	var videoArray = [];
	var allVideoArray = [];
	var channelIdArray = [];
	var playlistIdArray = [];
	



	function searchSongs(keyword){
		$('.songLinks').empty();
		keyword = keyword.replace(/ /g,"+");
		console.log(keyword);
		var queryURL = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=' + keyword + '&key=' + ytAPIKey;
		
		// Creates AJAX call for the specific movie being 
		$.ajax({url: queryURL, method: 'GET'}).done(function(response) {
			var results = response.items;
        	console.log(queryURL);
        	console.log(response);
        	console.log(results);

        	
        	Object.keys(results).forEach(function(key,index) {

        		videoArray = [];
	        	var num = parseInt(key)+1;
	        	var videoDiv = $('<div>');

	        	if(results[key].id.videoId){
		        	var title = results[key].snippet.title;
		        	var videoId = results[key].id.videoId;
		        	videoArray.push(title); 
		        	var pOne = $('<p>').html('<i class="tiny material-icons">play_circle_outline</i><a style="text-transform:none">  ' + title + '</a>').css({'font-size': '12px', 'margin-top':'10px','margin-bottom':'1px', 'cursor':'pointer'});
		        	pOne.attr('id', videoId);
		        	pOne.on('click',onClick);
		        	videoDiv.append(pOne);
		        } else {
		        	var title = results[key].snippet.title;
		        	videoArray.push(title);
		        	var pOne = $('<p>').text(title).css({'font-size': '10px','margin-top':'10px','margin-bottom':'1px'});
		        	//videoDiv.append(pOne);
		        	
		        }

	        	var image = results[key].snippet.thumbnails.default.url;
	        	videoArray.push(image);
	        	var pTwo = $('<p>').text("Image: " + image).css('margin','1px');
	        	//videoDiv.append(pTwo);

	        	var thumbnail = $('<img>');
					thumbnail.attr('id', 'thumbnails');
					thumbnail.attr('src', results[key].snippet.thumbnails.default.url);
				//videoDiv.append(thumbnail);

				if(results[key].id.videoId){
					//console.log("videoID");
					var videoId = results[key].id.videoId;
		        	videoArray.push(videoId);
		        	var pThree = $('<p>').text("VideoId: " + videoId).css('margin','1px');
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



	function onClick(){
		$('.video').empty();
		vidId = $(this).attr('id');
		$('.video').html('<iframe width="395" height="315" src="https://www.youtube-nocookie.com/embed/' + vidId + '?rel=0&"&amp;controls=0&autoplay=1&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>');
     };
     
// });