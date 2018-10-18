
// Require dotenv package to set environment variables to the global process.env object in node.
// These are values that are meant to be specific to the computer that node is running on,
// and since we are gitignoring this file, they won't be pushed to github.
require("dotenv").config();

// _______________________________________________________________________________________________
// Request Node packages: Twitter, Spotify, Request for movies (OMDB API), FS to read and append files, and the keys file for our keys.
var request = require("request");
var moment = require("moment");
var fs = require("fs");
var Spotify = require('node-spotify-api');
//var Twitter = require('twitter');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var logFile = "Data logged to log.txt file."

//_________________________________________________________________________________________________
// Variables to store our command line arguments
// Bonus:  In addition to logging the data to your terminal/bash window
// output the data to a .txt file called log.txt.
// Make sure you append each command you run to the log.txt file.

var liriCommand = process.argv[2];
var userInput = process.argv[3];

//_________________________________________________________________________________________________
//COMMANDLINE ARGUMENTS
// Differentiating command line arguments and running a function that corresponds to current cl argument and also logging command to log.txt
// But if command line argument is node liri.js do-what-it-says, then using the fs Node Package, 
// LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
//It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
//Feel free to change the text in that document to test out the feature for other commands.

if (liriCommand === "movie-this") {
    logData("liri-command = movie-this");
    getMovie(userInput);
} else if (liriCommand === "my-tweets") {
    getTweets(userInput);
} else if (liriCommand === "spotify-this-song") {
    logData("liri-command = spotify-this-song");
    getSong(userInput);
} else if (liriCommand === "concert-this") {
    logData("liri-command = concert-this");
    getConcert(userInput);
} else if (liriCommand === "do-what-it-says") {
    logData("liri-command = do-what-it-says");
    doWhatItSays();
} else {
    console.log("This Liri command you have entered does not exist.");
}


//________________________________________________________________________________________________________
// FUNCTIONS
//________________________________________________________________________________________________________

//*******Get Concert function runs when liri command === concert-this************************
function getConcert(userInput) {
    request("https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp", function (error, response, body) {

        //If the request is successful
        if (!error && response.statusCode === 200) {
            var body = JSON.parse(body);

            var concertResults =
                    "________________________________________________" + "\r\n" +
                    //Output the artist
                    "Venue Name: " + body[0].venue.name + "\r\n" +
                    //Output the song's name.
                    "Venue Location: " + body[0].venue.city + ", " + body[0].venue.region + ", " + body[0].venue.country + "\r\n" +
                    //Output a preview link of the song from Spotify.
                    "Concert Date: " + body[0].datetime + "\r\n" +
                    "________________________________________________";
                //Display song info in the terminal.
                console.log(concertResults);

                logData(concertResults);
        }

    });
};


//*********Get movie function ................. *************************************************
function getMovie(userInput) {
//If no movie name is specified on the command line, then show the movie info for the movie, Mr. Nobody.
if (!userInput) {
    //If no movie is specified... Mr. Nobody.
    userInput = "Mr Nobody";
    console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/");
    console.log("It's on Netflix!")
}
    request("http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var body = JSON.parse(body);
            //console.log(body);
            var movieResults =
                    "________________________________________________" + "\r\n" +
                    //Output the artist
                    "Movie Title: " + body.Title + "\r\n" +
                    //Output the song's name.
                    "Release Date: " + body.Year + "\r\n" +
                    //Output a preview link of the song from Spotify.
                    "IMDB Rating: " + body.imbdRating + "\r\n" +
                    //Output the album that the song is from.
                    "Rotten Tomatoes Rating: " + body.Ratings[1].Value + "\r\n" +
                    "Country: " + body.Country + "\r\n" +
                    "Language: " + body.Language + "\r\n" +
                    "Plot: " + body.Plot + "\r\n" +
                    "Actors: " + body.Actors + "\r\n" +
                    "________________________________________________";
                //Display song info in the terminal.
                console.log(movieResults);

                logData(movieResults);


        } else {
            return console.log(error)

        }


    });
};



//********* Get Song Function ................. *************************************************
function getSong(userInput) {
    if (userInput) {
        var song = userInput
    } else {
        var song = "The Sign"
    }
    spotify.search({ type: 'track', query: song, limit: 10 }, function (error, data) {
        if (error) {
            return console.log(error);
        }

        else {
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
                    "________________________________________________" + "\r\n" +
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

                logData(songResults);
            }

        }

    });
};

//********* doWhatItSays Function ................. *************************************************
function doWhatItSays() {

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }

        var songdataArray = data.split(",");
        getSong(songdataArray[1]);
        logData(songdataArray[1]);
    });
}

//********* logData Function logs to log.txt ................. *************************************************


function logData(logResults) {

    fs.appendFile("log.txt", logResults + "\r\n" , function(error) {
    if (error) {
        return console.log(error);
    }
    // If there is no error
    else {
        // Do nothing ----> //console.log("Data Logged");
    }
});

}


// done











/*
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
	    	
	    	var tweetResults = 
	    		"__________________________________________________________" + "\r\n" +
					"Created at: " + tweets[i].created_at + "\r\n" +
	    		    "Tweet: " + tweets[i].text + "\r\n" +		
	    		"____________________________________________________________" 

	    	//display data for user
	    	console.log(myTweetResults);
	    	//log data to log.txt
	    	logData(myTweetResults);
	    }
	  }
	});
} */
