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

//Connecting to port 3000
app.listen(process.env.PORT || "3000",()=>{
	console.log("Started App at port 3000");
});

