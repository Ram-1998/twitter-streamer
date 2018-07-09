# twitter-streamer
A Simple Twitter Based Application where you can search abou tweets based on Date Folter , User Filter etc..

## Prerequisites
```

(1) - NodeJs
(2) - MongoDB
(3) - Express
(3) - Basic Knowledge of Rest API

```

### Documentation

[Read API documentation Here](https://documenter.getpostman.com/view/3998711/simple-messaging-app/RVtvqYmv)

### Live Link

[Click here to use API](https://fathomless-shore-82374.herokuapp.com)

## API Paths

### (1) POST /filter
```

```
### (2) GET /streamOn

```

```

### (3) GET /streamOff

```

```

### (4) GET /Trending

```

```


## *DataBase Design of Tweets*
```
	id : String
	id_str : String
	userId : String
	userName : String
	userHandle : String
	text : String
	createdAt : Date
	retweets : Number
	favorite : Number
	userFollower : Number
	language : String
	location : [Number]
	userMention :[String]
	HashTags : [String]
	URL : [String]
```

## DataBase Set Index Command for Text Search

```
db.tweets.ensureIndex({ text: "text" }, { language_override: "lang" });

```

## Developed By
* **Shree Ram Bansal** [Linkedin](https://www.linkedin.com/in/shree-ram-b-a48786104/) | [Facebook](https://www.facebook.com/shreeram.bansal)