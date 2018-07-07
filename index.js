var express = require("express");
var Twitter = require('twit');
var config  = require('./config.js');
var route = require('./routes/index');
var mongodb = require("mongodb");
var mongoose = require("mongoose");
var Tweet = require('./models/tweet');

var app = express();
//Connect to Mongoose Server
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/twitter-streamer",()=>{
		console.log("Database Connected");
	}
);
var db = mongoose.connection;

//Initializing Client;
var client = new Twitter(config);

//Set routes
app.use('/',route);

//Satting Statis Directory
app.use(express.static(__dirname));

//Start twitter streaming
var stream = client.stream('statuses/sample');
stream.on('tweet',tweetEvent);
 
function tweetEvent(tweet){
	var newTweet = new Tweet ({
		id : tweet.id,
		id_str : tweet.id_str,
		userId : tweet.user.id,
		userName : tweet.user.name,
		userHandle : tweet.user.screen_name,
		text : tweet.text,
		createdAt : tweet.created_at,
		retweets : tweet.retweet_count,
		favorite : tweet.favorite_count,
		language : tweet.lang,
		location : tweet.geo,
		userFollower : tweet.user.follower_count,
		userMention :tweet.entities.user_mentions.screen_name,
		HashTags : tweet.entities.hahtags,
		URLs : tweet.entities.urls
	});
	Tweet.createTweet(newTweet,function(err,tweet){
		if(err) throw err;
		console.log(tweet);
	});
}

//Connecting to port 3000
app.listen(process.env.PORT || "3000",()=>{
	console.log("Started App at port 3000");
});

