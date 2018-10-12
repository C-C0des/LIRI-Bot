
///TWITTER API KEY APPLICATION WAS NOT APPROVED. 
// Will marks be deducted? 


//****************************************** 





// Require dotenv package to set environment variables to the global process.env object in node.
// These are values that are meant to be specific to the computer that node is running on,
// and since we are gitignoring this file, they won't be pushed to github.
require("dotenv").config();

//_______________________________________________________________________________________________
//Request Node packages: Twitter, Spotify, Request for movies (OMDB API), FS to read and append files, and the keys file for our keys. 
var request = require("request");
var fs = require("fs");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var keys = require("./keys.js");

//_________________________________________________________________________________________________
//Variables to store our command line arguments 
// Bonus:  In addition to logging the data to your terminal/bash window
// output the data to a .txt file called log.txt.
//Make sure you append each command you run to the log.txt file.

var userInput = process.argv;
var liriCommand = userInput[2];
var movieName = "";
var songName = "";

var logFile = "Data logged to log.txt file."

//_________________________________________________________________________________________________
//COMMANDLINE ARGUMENTS
// Differentiating command line arguments and running a function that corresponds to current cl argument and also logging command to log.txt
// But if command line argument is node liri.js do-what-it-says, then using the fs Node Package, 
// LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
//It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
//Feel free to change the text in that document to test out the feature for other commands.

if (liriCommand === "movie-this") {
	logData("liri Command: movie-this")
	getMovie();
 } else if (liriCommand === "my-tweets") {
	logData("Liri Command: my-tweets");
	getTweets();
 } else if (liriCommand === "spotify-this-song") {
	 logData("Liri Command: spotify-this-song")
	getSong(songName);
} else if (liriCommand === "do-what-it-says") {
	logData("Liri command: do-what-it-says");
	doWhatItSays();
} else {
	console.log("This Liri command you have entered does not exist.");
}


//________________________________________________________________________________________________________-
//FUNCTIONS

//-----------------------------
//Get movie function
//-----------------------------


function getMovie() {

	for (var i = 3; i < userInput.length; i++) {

	  if (i > 2 && i < userInput.length) {
	    movieName = movieName + " " + userInput[i];
	  }
	 
	}

	//If no movie name is specified on the command line, then show the movie info for the movie, Mr. Nobody.
	 if (!movieName) {
	 	//If no movie is specified, set movieName equal to Mr. Nobody.
	 	movieName = "Mr Nobody";
	 	console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/");
	 	console.log("It's on Netflix!")
	}

	// //3.use the request package to retrieve data from the OMDB API
	request("http://www.omdbapi.com/?t=" + movieName + "&apikey=trilogy", function(error, response, body) {

		//If the request is successful 
		if (!error && response.statusCode === 200) {
			//Parse the body of the raw string
			var movieInfo = JSON.parse(body);
			

			var movieResult = 
				"____________________________________________________________" + "\r\n" +
				 movieName + "\r\n" +
				"____________________________________________________________" + "\r\n" +
				//Title of the movie.
				"Title: " + movieInfo.Title + "\r\n" +
				//Year the movie came out.
				"Released in: " + movieInfo.Year + "\r\n" +
				//IMDB Rating of the movie.
				"IMDB movie rating: " + movieInfo.imdbRating + "\r\n" +
				//Rotten Tomatoes rating of the movie.
				"Rotten Tomatoes rating: " + movieInfo.Ratings[1].Value + "\r\n" +
				//Country where the movie was produced.
				"Filmed in: " + movieInfo.Country + "\r\n" +
				//Language of the movie.
				"Language: " + movieInfo.Language + "\r\n" + 
				//Plot of the movie.
				"Movie plot: " + movieInfo.Plot + "\r\n" +
				//Actors in the movie.
				"Actors: " + movieInfo.Actors + "\r\n" +
				//Line break
				"_________________________________________________________________"

			//Display movie data
			console.log(movieResult);
			//Output data to log.txt file.
			logData(movieResult);
		}
	});
 }

//-------------------------------
//Get tweets function
//------------------------------
function getTweets(){

	var client = new Twitter({
		consumer_key: process.env.TWITTER_CONSUMER_KEY,
		consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
		access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
		access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
	});


	var params = {screen_name: 'CCODES'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	    console.log("My tweets");
	    logData("My tweets");
	    for (var i=0; i < tweets.length; i ++) {
	    	
	    	var myTweetResults = 
	    		"__________________________________________________________" + "\r\n" +
					//Output the date/time when the tweet was created to the terminal.
					"Created at: " + tweets[i].created_at + "\r\n" +
				    //Output the tweet text from Twitter to the terminal.
	    		    "Tweet: " + tweets[i].text + "\r\n" +		
	    		"____________________________________________________________" 

	    	//display data for user
	    	console.log(myTweetResults);
	    	//log data to text.file
	    	logData(myTweetResults);
	    }
	  }
	});
}



//-------------------------------
//Get Songs function
//------------------------------

function getSong(songName) {

	for (var i=3; i < userInput.length; i++){
		songName = songName + " " + userInput[i];
	}

	logData("liri, spotify-this-song");

	//var spotify = new Spotify(keys.spotify);
	var spotify = new Spotify({
  		id: process.env.SPOTIFY_ID,
  		secret: process.env.SPOTIFY_SECRET
	});

	//If no song name is provided, show song info for "The Sign" by Ace of Base by default.
	if (!songName) {
		songName = "The Sign";
	}


	//search for songs using spotify package .
	spotify.search({ type: 'track', query: songName, limit: 15 }, function(err, data) {

  		if (err) {
    		return console.log('Error: ' + err);
  		}
 
	//If no song is provided, then the app will default to "The Sign" by Ace of Base.
	if (songName === "The Sign") {
		//output the default song information
		var defaultSong = 
		//Output the artist
		"Artist: " + data.tracks.items[5].artists[0].name + "\r\n" + 
		//Output the song's name.
		"Song title: " + data.tracks.items[5].name + "\r\n" +
		//Output a preview link of the song from Spotify.
		"Preview song: " + data.tracks.items[5].preview_url + "\r\n" +
		//Output the album that the song is from.
		"Album: " + data.tracks.items[5].album.name + "\r\n" 

		//console.log default song info to terminal
		console.log (defaultSong);
		console.log(logFile);
		//add default song info to log.txt file.
		logData(defaultSong);
	}


	//If song name is provided:
	else {
		console.log(songName);
		logData(songName);
	
		for (var i = 0; i < data.tracks.items.length; i++) {
			var trackInfo = data.tracks.items[i];

			//Create variable for song preview link.
			var previewSong = trackInfo.preview_url;
			//If the song preview is not available, display the song preview is not available.
			if (previewSong === null) {
				previewSong = "Song preview is not available for this song.";
			}
			//song results. 
			var songResults = 
			
				"___________________________________________________" + "\r\n" +
				//Output the artist
				"Artist: " + trackInfo.artists[0].name + "\r\n" +
				//Output the song's name.
				"Song title: " + trackInfo.name + "\r\n" +
				//Output a preview link of the song from Spotify.
				"Preview song: " + previewSong + "\r\n" +
				//Output the album that the song is from.
				"Album: " + trackInfo.album.name + "\r\n" +
				"________________________________________________";

			//Display song info in the terminal.
			console.log(songResults);
			//Display song info in the log.txt file.
			logData(songResults);
		}
	}
	});
}

//-------------------------------
// Do What it says  function
//------------------------------
// For this command... Using the fs Node package,
// LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
//liriCommand is do-what-it-says, take the text inside of random.txt
// and then use it to run spotify-this-song for "I want it that way."


function doWhatItSays() {
	
	fs.readFile("random.txt", "utf8", function(error, data) {
  		if (error) {
    		return console.log(error);
  		}
  	
  		var songdataArray = data.split(",");
  		getSong(songdataArray[1]);
 	});
}

//-----------------------------------
// Log Data function
//-----------------------------------

//In addition to logging the data to your terminal/bash window, 
//output the data to a .txt file called log.txt.
//Make sure you append each command you run to the log.txt file. 
//Do not overwrite your file each time you run a command.

function logData(logResults) {

	fs.appendFile("log.txt", logResults + "\r\n" , function(err) {
	if (err) {
		console.log(err);
	}
	// If there is no error
	else {
		// Do nothing ----> //console.log("Data Logged"); 
	}
});

}

