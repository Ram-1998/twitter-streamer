var express = require("express");
var dotenv = require('dotenv').config();
var Twitter = require('twitter');
var config  = require('./config.js');
var route = require('./routes/index');
var mongodb = require("mongodb");
var mongoose = require("mongoose");
var Tweet = require('./models/tweet');
var bodyParser = require('body-parser');

var app = express();

//Socket for Client interation
var http = require('http').Server(app);
var io = require('socket.io')(http);
var count = 0;

//Body Parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(__dirname));
 //set Routes
app.use('/',route);

http.listen( process.env.PORT || 3000, function(){
  console.log('listening on ' + process.env.PORT || 3000);
});

//Connect to Mongoose Server
mongoose.connect(process.env.MONGODB_URI || "mongodb://ram:ram1234@ds219432.mlab.com:19432/twitter-streamer" ,()=>{
		console.log("Database Connected");
	}
);
// mongoose.connect(process.env.MONGODB_URI ||  "mongodb://localhost:27017/twitter-streamer",()=>{
// 		console.log("Database Connected");
// 	}
// );
var db = mongoose.connection;

//Initializing Client;






//Satting Statis Directory


//Connecting to port 3000
// app.listen(process.env.PORT || 3000,function(){
// 	console.log('listening on ' + process.env.PORT || 3000);
// });
// app.listen(3000,function(){
// 	console.log('listening on ' + process.env.PORT || 3000);
// });
var client = new Twitter({
  consumer_key: 'iNudtBUJHc5DIPgke8hoX3NRE',
  consumer_secret: 'QN68nJhVw4m9eBhh6NdtuB94zpOyiAbVnIrsgrs34WDFdf6szc',
  access_token_key: '593289272-mPN6HXtge1y43ApYeC1be2yT4Z6G8YDZ9XAqOnBb',
  access_token_secret: 'rHt0YpZB9sHRILniO62v1rJBVQ916sa4qU0O5fmGLPtjr'
});
console.log(client);

io.on('connection', function(socket){
		count++;
		console.log('a user connected ' + count);
		  client.stream('statuses/filter', {locations: '-180,-90,180,90'}, function(stream) {
		  	stream.on('data', function(data) {
		  		if (data.coordinates) {
		  			console.log(data.coordinates.coordinates);
		        var r = Math.sqrt(data.user.followers_count);
		  			//console.log(r);
		  					io.emit('twitter', {
		  						coordinates: data.coordinates,
		  						radius: r
		  					});
		  				}
		  			});

		    stream.on('error', function(error) {
		      throw error;
		    });

		    socket.on('disconnect', function(){
		      console.log('user disconnected ' + count);
		      count--;

		      // if(count == 0){
		      //   stream.destroy();
		      // }
		    });
		 });
	}); 
// var stream = client.stream('statuses/sample');

