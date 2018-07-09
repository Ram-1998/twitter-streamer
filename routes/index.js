var express = require('express');
var router = express.Router();
var Tweet = require('../models/tweet');
var Twitter = require('twit');
var config = require('../config.js')
var date = require('date-and-time');
var density = require('density');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
//init twitter client
var client = new Twitter(config);

router.get('/streamOn',function(req,res){
	var stream = client.stream('statuses/sample');
	stream.start();
	stream.on('tweet',tweetEvent);
 
	function tweetEvent(tweet){
		console.log(tweet);
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
				HashTags : tweet.entities.hahtags,
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
				HashTags : tweet.entities.hahtags,
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
	var stream = client.stream('statuses/sample');
	stream.stop();
});

//--------------------------Find Trending Topics ------------------------//
router.get('/Trending/:word',function(req,res){
	var now = new Date();
	var word = req.params.word;
	var responseArray = [];
	var threeDaysBefore = date.addDays(now, -10);
	var threeDaysBefore1 = date.format(threeDaysBefore, 'YYYY-MM-DD');
	var query = word+' since:'+threeDaysBefore1;
	console.log(query);
	client.get('search/tweets', { q: query , count: 999990 }, function(err, data, response) {
  		var tweets = data.statuses;
  		console.log(tweets.length);
  		var words = [];
  		var uniqueWord = [];
  		var uniqueWordCount = [];
  		for (var i = 0; i < tweets.length; i++) {
  			if(tweets[i].entities.hashtags.length > 0){
  				for (var j = 0; j < tweets[i].entities.hashtags.length; j++) {
  					words.push(tweets[i].entities.hashtags[j].text);
  				}
  				
  			}
  		}
  		for(i=0;i<words.length;i++){
  			if(uniqueWord.indexOf(words[i]) == -1){
  				uniqueWord.push(words[i]);
  				uniqueWordCount.push(1);
  			}
  			else{
  				uniqueWordCount[uniqueWord.indexOf(words[i])]++;
  			}
  		}
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
  		res.json(responseArray);
	})
// 	client.get('search/tweets', { q: 'modi since:2018-06-09', count: 100 }, function(err, data, response) {
//  		var tweets = data.statuses;
//  		console.log(tweets);
//  		for (var i = 0; i < tweets.length; i++) {
//  			console.log(tweets[i].entities);
//  		}
// }	)
 
});


//-----------------------------Filter Tweet Query----------------//
router.post('/filter', function(req, res, next) {

	// console.log(req.body.abc);
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

	// var query = '{';

	// if(screenName != null)
	// 	query += ' userHandle : '+screenName+' ,';
	// if(retweetCount != null)
	// 	query += ' retweets : { $gte : '+retweetCount+' } ,';
	// if(favrioteCount != null)
	// 	query += ' favorite : { $gte : '+favrioteCount+' } ,';
	// if(UserfollowerCount != null)
	// 	query += ' userFollower : { $gte : '+favrioteCount+' } ,';
	// if(userMention != null)
	// 	query += ' userMention : '+userMention+' ,';
	// if(startDate != null && endDate != null){
	// 	query += ' createdAt : { $gte : '+startDate+','+'$lte : '+endDate+' } ,';
	// }
	// else if(startDate != null){
	// 	query += ' createdAt : { $gte : '+startDate+' } ,';
	// }
	// else if(endDate != null){
	// 	query += ' createdAt : { $lte : '+endDate+' } ,';
	// }
	// if(language != null)
	// 	query += ' language : { $in : '+language+' } ,';

	// query = query.slice(0,query.length-1);
	// query += '}';
	//res.json(query);
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
