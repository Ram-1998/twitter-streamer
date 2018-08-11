var express = require('express');
var router = express.Router();
var Tweet = require('../models/tweet');
var Twitter = require('twit');
var config = require('../config.js')
var date = require('date-and-time');
var density = require('density');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
//-----------------------------
var app = express();
//Socket for Client interation
var http = require('http').Server(app);
var io = require('socket.io')(http);

var count = 0;
var client = new Twitter(config);
var stream = client.stream('statuses/sample');

router.get('/',function(req,res){
	res.sendFile(__dirname + '/index.html');
});
router.get('/streamOn',function(req,res){
	stream.start();
	stream.on('tweet',tweetEvent); 	
	function tweetEvent(tweet){
		var hashtags1=[];
		for (var i = 0; i < tweet.entities.hashtags.length; i++) {
			hashtags1.push(tweet.entities.hashtags[i].text);
		}
		if(tweet.geo != null){
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
				location : tweet.geo.coordinates,
				userFollower : tweet.user.followers_count,
				userMention :tweet.entities.user_mentions.screen_name,
				HashTags : hashtags1,
				URLs : tweet.entities.urls
			});
		}
		else{
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
				userFollower : tweet.user.followers_count,
				userMention :tweet.entities.user_mentions.screen_name,
				HashTags : hashtags1,
				URLs : tweet.entities.urls
			});
		}
	
		Tweet.createTweet(newTweet,function(err,tweet){
			if(err) throw err;
			console.log(tweet);
		});


	}
});

router.get('/streamOff',function(req,res){
	stream.stop();
});

/////.........................another trending function............./////
var tweets;
var words = [];
var uniqueWord = [];
var uniqueWordCount = [];
router.get('/Trending',function(req,res){
	var Tweet1 = [];
	var stream = client.stream('statuses/sample');
	stream.start();
	stream.on('tweet',tweetEvent);
	var responseArray = [];
	function tweetEvent(tweet){
		//console.log(tweet);
		//console.log(tweet.entities.hashtags);
		var hashtags1=[];
		for (var i = 0; i < tweet.entities.hashtags.length; i++) {
			hashtags1.push(tweet.entities.hashtags[i].text);
		}
		//console.log(hashtags1[0]);
		if(tweet.geo != null){
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
				location : tweet.geo.coordinates,
				userFollower : tweet.user.followers_count,
				userMention :tweet.entities.user_mentions.screen_name,
				HashTags : hashtags1,
				URLs : tweet.entities.urls
			});
		}
		else{
			var newTweet = new Tweet ({
				id : tweet.id,
				id_str : tweet.id_str,
				userId : tweet.user.id,
				userName : tweet.user.name,
				userHandle : tweet.user.screen_name,
				text : tweet.text,
				createdAt : tweet.created_var,
				retweets : tweet.retweet_count,
				favorite : tweet.favorite_count,
				language : tweet.lang,
				location : tweet.geo,
				userFollower : tweet.user.followers_count,
				userMention :tweet.entities.user_mentions.screen_name,
				HashTags : hashtags1,
				URLs : tweet.entities.urls
			});
		}
		//console.log(newTweet.HashTags);
		if(newTweet.HashTags.length > 0){
		for (var j = 0; j < newTweet.HashTags.length; j++) {
			//console.log(newTweet.HashTags[j]);
			Tweet1.push(newTweet.HashTags[j]);
		}
	}
	//	Tweet1.push(newTweet.HashTags);
	//console.log(Tweet1.length);
	// for (var i = 0; i < Tweet1.length; i++) {
	// 	console.log(Tweet1[i]);
	// }
	tweets=Tweet1;
	words=tweets;
	for(i=0;i<words.length;i++){
		if(uniqueWord.indexOf(words[i]) == -1){
			uniqueWord.push(words[i]);
			uniqueWordCount.push(1);
		}
		else{
			uniqueWordCount[uniqueWord.indexOf(words[i])]++;
		}
	}



}
setTimeout(function(){
	stream.stop();
	for (var i = 0; i < uniqueWordCount.length; i++) {
		for (var j = i; j < uniqueWordCount.length; j++) {
			if(uniqueWordCount[i] < uniqueWordCount[j]){
				var temp = uniqueWordCount[i];
				uniqueWordCount[i] = uniqueWordCount[j];
				uniqueWordCount[j] = temp;
				var temp = uniqueWord[i];
				uniqueWord[i] = uniqueWord[j];
				uniqueWord[j] = temp;
			}
		}
	}

	for (var i = 0; i < 10; i++) {
		var obj = {word : uniqueWord[i] , count : uniqueWordCount[i]}
		responseArray.push(obj);
		//console.log(uniqueWord[i] , uniqueWordCount[i]);
	}
	//console.log(responseArray);
	res.setHeader('Content-Type', 'application/json');
	res.json(responseArray);
	res.end();
  }, 30000);
	//console.log('r');
	stream.stop();
});

//-----------------------------Filter Tweet Query----------------//
router.post('/filter', function(req, res, next) {

	console.log(req.body);
	// res.json(req.body.abc);

	console.log("Filter Tweet Part");
	var text = req.body.text;
	var userName = req.body.userName;
	var screenName = req.body.screenName;
	var retweetCount = req.body.retweetCount;
	var UserfollowerCount = req.body.UserfollowerCount;
	var favrioteCount = req.body.favrioteCount;
	var userMention = req.body.userMention;
	var startDate = req.body.startDate;
	var endDate = req.body.endDate;
	var language = req.body.language;

	
	var query = {};
	if(text)
		query.$text = {$search : text};
	if(screenName)
		query.userHandle = screenName;
	if(userName)
		query.userName = userName;
	if(retweetCount)
		query.retweets = {$gte : retweetCount};
	if(favrioteCount)
		query.favorite = {$gte : favrioteCount};
	if(UserfollowerCount)
		query.userFollower = {$gte : UserfollowerCount};
	if(userMention)
		query.userMention = userMention;
	if(startDate && endDate ){
		query.createdAt = {$gte : startDate , $lte : endDate};
	}
	else if(startDate){
		query.createdAt = {$gte : startDate};
	}
	else if(endDate){
		query.createdAt = {$lte : endDate};
	}
	if(language)
		query.language = {$in : language};


	console.log(query);
	Tweet.SearchFilter(query,function(err,response){
		if(err) throw err;
		res.json(response);
	});

	// User.getUserByUname(recipient,function(err,receiver){
	// 	if(receiver.blockedUsers.indexOf(currUser.uname) == -1 ){
	// 		var message = {sender:currUser.uname,
	// 					   subject:messageSubject,
	// 					   body:messageBody};
	// 		User.sendMessage(receiver,message,function(err,result){
	// 			if(err) throw err;
	// 			console.log(receiver);
	// 			res.json("Message Sent Succesfully !!")
	// 		});			   
	// 	}
	// 	else{
	// 		res.json("Sorry you can't send message to "+ recipient);
	// 	}
	// });

});
module.exports = router;
