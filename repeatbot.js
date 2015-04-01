var bot = require('fancy-groupme-bot');

// local configuration read from env.
var TOKEN = "0e088af0a4b301327e9a16a8358f1ba3"; // your groupme api token
var USER_TOKEN = "55JqxdWFl4G29PSPDcp6O7Zc2grs74giP3wDIIXz";
var GROUP = "13176413"; // the room you want to join

var WOOSH_NAME = "wooshBot"; // the name of your bot
var WOOSH_URL = "https://groupme-wooshbot.herokuapp.com";
var WOOSH_TAIL = "/woosh"; // the domain you're serving from, 
//should be accessible by Groupme. e.g. not localhost
var JINX_NAME = "jinxBot"; // the name of your bot
var JINX_URL = "https://groupme-wooshbot.herokuapp.com";
var JINX_TAIL = "/jinx";

const WOOSH_CONFIG = {
	token: TOKEN,
	group: GROUP,
	name: WOOSH_NAME,
	url: WOOSH_URL + WOOSH_TAIL,
	tail: WOOSH_TAIL
};
const JINX_CONFIG = {
	token: TOKEN,
	group: GROUP,
	name: JINX_NAME,
	url: JINX_URL + JINX_TAIL,
	tail: JINX_TAIL
};

var mybot = bot(WOOSH_CONFIG);
var newBot = bot(JINX_CONFIG);

mybot.on('botRegistered', function(b) {
	console.log("I am registered");
	b.message("hey guys");
});

mybot.on('botMessage', function(b, message) {
	console.log("I got a message, fyi");
	if (message.name != b.name) {
		b.message(message.name + " said " + message.text);
	}
});

newBot.on('botRegistered', function(b) {
	console.log("I am registered");
	b.message("hey guys");
});

newBot.on('botMessage', function(b, message) {
	console.log("I got a message, fyi");
	if (message.name != b.name) {
		b.message(message.name + " said " + message.text);
	}
});

console.log("i am serving");
mybot.serve(8000);
