require("dotenv").config("dependencies": {
  "uglify-js": ">=2.6.0"
});
var request = require("request");
var inquirer = require("inquirer");
var input = process.argv[2];
var bandsintown = require('bandsintown')("codingbootcamp");
var answer = process.argv.slice(3).join(" ");
var Spotify = require("node-spotify-api")
var moment = require("moment");
var keys = require("./keys");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);


// OMDB Stuff
function movie() {
    request("http://www.omdbapi.com/?t=" + answer + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
       
        if (!error && response.statusCode === 200) {
            console.log("=====================================")
            console.log("* Title: " + JSON.parse(body).Title);
            console.log("* Year: " + JSON.parse(body).Year);
            console.log("* IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("* Country: " + JSON.parse(body).Country);
            console.log("* Language: " + JSON.parse(body).Language);
            console.log("* Plot: " + JSON.parse(body).Plot);
            console.log("* Actors: " + JSON.parse(body).Actors);
            console.log("=====================================")
        }
        

    });
}

//add bandsintown api stuff here
var bandName = input;

function concert() {
var queryUrl = ("https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp");

    request(queryUrl, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            var result = JSON.parse(body)[0];
            var date = moment(result.datetime).format("l" + " h:mm");
            console.log("============================");
            console.log("Artist: " + bandName);
            console.log("Name of Venue : " + result.venue.name);
            console.log("City: " + result.venue.city);
            console.log("Country: " + result.venue.country);
            console.log("Date and Time: " + date);
            console.log("Tickets: " + result.offers.url);
            console.log("============================");
        }

    });
}

//add spotify api stuff here
var song = answer;

function songSearch() {
    spotify.search({ type: 'track', query: song + '' }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
      
        console.log("============================================");
        console.log("Song Title : " + data.tracks.items[0].name);
        console.log("Artist : " + data.tracks.items[0].artists[0].name);
        console.log("Album : " + data.tracks.items[0].album.name);
        console.log("Preview : " + data.tracks.items[0].preview_url);
        console.log("============================================");
    });
}


function doSomething(){
    fs.readFile("random.txt", "utf8", function(error, data){
console.log(data);
 
        spotify.search({ type: 'track', query: data , limit: 1 }, function (err, data) {
            console.log(data.tracks.items[0].preview_url);
            if (error) {
                return console.log('Error occurred: ' + err);
            }
        
        });
    })
    }


//These are the function calls to make the api's work
//songSearch();
// movie();
// concert();

//build recursive function here
function ask(){
//Build the logic for the questions here
var asked = false;
console.log("\n**************************\n")
console.log("  ***Hit CTRL + C To Exit***");
console.log("\n**************************\n");

inquirer.prompt([
{
    type: "list",
    name: "start",
    message: "Hello, I am Liri your movie, music, and concert info hub.\n How can I help you?\n",
    choices: ["Search for movie", "Search for song", "Search for concert","Do something"]
    
  }
  
])

.then(function(response) {
var start = response.start;
if (start === "Search for movie") {

    console.log("==============================================");
    console.log("           OK THAT WORKS")
    console.log("==============================================");
    
 inquirer.prompt([
        {
            type: "input",
            name: "movieSearch",
            message: "Enter a movie name.",
          }
        ])
        
    .then(function(response) {
        asked = true;
        answer = response.movieSearch;
           movie(); 
           console.log("==========================");
           if(asked === true){
            ask();
        }
        })
        
  }
  if(start === "Search for song"){
      console.log("******************************");
      console.log("         EVEN BETTER!");
      console.log("******************************");
    inquirer.prompt([
        {
            type: "input",
            name: "songSearch",
            message: "Enter a song name.",
        }
    ])
    .then(function(response){
        asked = true;
        song = response.songSearch;
        songSearch();
        console.log("============================");
        if(asked === true){
            ask();
            }
    })
  }
  if(start === "Search for concert"){
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      console.log("        ROCK ON!!!");
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      inquirer.prompt([
          {
              type: "input",
              name: "concertSearch",
              message: "Name an artist you would like to see.",
          }
      ])
      .then(function(response){
          asked = true;
          bandName = response.concertSearch;
          concert();
          console.log("============================");
        if(asked === true){
            ask();
            }
      })
  }
  if(start === "Do something"){
      asked = true;
    console.log("______________________________");
    console.log("        Hmmmmmmm......Okay");
    console.log("______________________________");
   doSomething();
   console.log("============================");
   if(asked === true){
       ask();
       }
}
})
}
ask();
