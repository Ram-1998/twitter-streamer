var mongoose = require('mongoose');
require('mongoose-type-url');
var tweetSchema = mongoose.Schema({
	id : String,
	id_str : String,
	userId : String,
	userName : String,
	userHandle : String,
	text : String,
	createdAt : Date,
	retweets : Number,
	favorite : Number,
	userFollower : Number,
	language : String,
	location : [Number],
	userMention :[String],
	HashTags : [String],
	URL : [String]
});
var tweet = module.exports = mongoose.model('tweet',tweetSchema);

//---------------------------DataBase Functions----------------------

module.exports.createTweet = function(newTweet,callback){
	//console.log(newTweet);
	newTweet.save(callback);
}

//----------------------------Filter API Function-----------------------

module.exports.SearchFilter = function(query,callback){
	//console.log(newTweet);
	tweet.find(query,callback);
}