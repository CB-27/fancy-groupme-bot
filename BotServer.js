var http = require('http'),
	request = require('request'),
	util = require('util'),
	events = require('events'),
	tls = require('tls'),
	fs = require('fs'),
	formidable = require('formidable');

function BotServer(config) {
	if (!(this instanceof BotServer)) return new BotServer(config);
	var options = "";
	for (var key in config) {
		if (config.hasOwnProperty(key)) this[key] = config[key];
	}
	if (this["privateKey"] !== null && this["certificate"] !== null) {
		options = {
			key: fs.readFileSync(this.privateKey),
			cert: fs.readFileSync(this.certificate)
		};
	}
	console.log("registering the server");
	if (options !== "") {
		this.serve(this.port, options);
	} else {
		this.serve(address);
	}
}


util.inherits(BotServer, events.EventEmitter);
var locs = [];
BotServer.prototype.addPath = function(path) {
	console.log("Added " + path);
	if (typeof(locs) != "undefined") {
		locs[locs.length] = path;
	} else {
		locs = [path];
	}
};


BotServer.prototype.serve = function(address) {
	var self = this;
	var botServer = http.createServer(function(request, response) {
		request.headers.host = this.url;
		if (request.url == '/' && request.method == 'GET') {
			response.writeHead(200, {
				"Content-Type": "application/json"
			});
			response.end(JSON.stringify({
				'name': self.name,
				'group': self.group
			}));
		} else if (acceptableLoc(request.url) && request.method == 'POST') {
			var form = new formidable.IncomingForm();
			var messageFields = {};
			form.parse(request, function(err, fields, files) {
				if (err) console.error("bad incoming data " + err);
			});

			form.on('field', function(name, value) {
				messageFields[name] = value;
			});

			form.on('end', function() {
				response.writeHead(200, {
					"Content-Type": "text/plain"
				});
				response.end("THANKS");
				console.log("BotServer sent message");
				self.emit('serverMessage', {
					botName: self.name,
					attachments: messageFields.attachments,
					avatar_url: messageFields.avatar_url,
					created_at: messageFields.created_at,
					group_id: messageFields.group_id,
					id: messageFields.id,
					name: messageFields.name,
					sender_id: messageFields.sender_id,
					sender_type: messageFields.sender_type,
					source_guid: messageFields.source_guid,
					system: messageFields.system,
					text: messageFields.text,
					user_id: messageFields.user_id,
					payload: messageFields.payload
				});
			});
		} else {
			response.writeHead(404, {
				"Content-Type": "text/plain"
			});
			response.end("NOT FOUND");
		}
	}.bind(this));
	botServer.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});
	botServer.listen(address);
};

BotServer.prototype.serve = function(address, options) {
	var self = this;
	var botServer = tls.createServer(function(request, response) {
		request.headers.host = this.url;
		if (request.url == '/' && request.method == 'GET') {
			response.writeHead(200, {
				"Content-Type": "application/json"
			});
			response.end(JSON.stringify({
				'name': self.name,
				'group': self.group
			}));
		} else if (acceptableLoc(request.url) && request.method == 'POST') {
			var form = new formidable.IncomingForm();
			var messageFields = {};
			form.parse(request, function(err, fields, files) {
				if (err) console.error("bad incoming data " + err);
			});

			form.on('field', function(name, value) {
				messageFields[name] = value;
			});

			form.on('end', function() {
				response.writeHead(200, {
					"Content-Type": "text/plain"
				});
				response.end("THANKS");
				console.log("BotServer sent message");
				self.emit('serverMessage', {
					botName: self.name,
					attachments: messageFields.attachments,
					avatar_url: messageFields.avatar_url,
					created_at: messageFields.created_at,
					group_id: messageFields.group_id,
					id: messageFields.id,
					name: messageFields.name,
					sender_id: messageFields.sender_id,
					sender_type: messageFields.sender_type,
					source_guid: messageFields.source_guid,
					system: messageFields.system,
					text: messageFields.text,
					user_id: messageFields.user_id,
					payload: messageFields.payload
				});
			});
		} else {
			response.writeHead(404, {
				"Content-Type": "text/plain"
			});
			response.end("NOT FOUND");
		}
	}.bind(this));
	botServer.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});
	botServer.listen(address);
};



function acceptableLoc(loc) {
	console.log("Checking if " + loc + " is ok");
	for (var i = 0; i < locs.length; i++) {
		console.log("Checking " + locs[i]);
		if (loc.indexOf(locs[i]) > -1) {
			console.log("Go for it!");
			return true;
		}
	}
	console.log("nah");
	return false;
}

module.exports = BotServer;
