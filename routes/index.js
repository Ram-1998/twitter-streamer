var express = require('express');
var router = express.Router();
var Tweet = require('../models/tweet');
var Twitter = require('twit');
var config = require('../config.js')
var date = require('date-and-time');
var density = require('density');
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
				userFollower : tweet.user.follower_count,
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
				userFollower : tweet.user.follower_count,
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
router.get('/Trending',function(req,res){
	var now = new Date();
	var threeDaysBefore = date.addDays(now, -30);
	var threeDaysBefore1 = date.format(threeDaysBefore, 'YYYY-MM-DD');
	var query = 'modi since:'+threeDaysBefore1;
	console.log(query);
	client.get('search/tweets', { q: 'modi', count: 999999999 }, function(err, data, response) {
  		var tweets = data.statuses;
  		var words = [];
  		var uniqueWord = [];
  		var uniqueWordCount = [];
  		for (var i = 0; i < tweets.length; i++) {
  			if(tweets[i].entities.hashtags.length > 0)
  				words.push(tweets[i].entities.hashtags[0].text);
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
  			console.log(uniqueWord[i] , uniqueWordCount[i]);
  		}
	})
});
module.exports = router;
