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
	language : String,
	location : String,
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
