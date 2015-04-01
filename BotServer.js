var http = require('http'),
	request = require('request'),
	util = require('util');

function BotServer(config) {
	if (!(this instanceof BotServer)) return new BotServer(config);
	for (var key in config) {
		if (config.hasOwnProperty(key)) this[key] = config[key];
	}
	this.locs[this.locs.length] = this.tail;
	console.log("registering the server");
	this.serve(this.port);
};


util.inherits(BotServer, events.EventEmitter);


BotServer.prototype.serve = function(address) {
	var self = this;
	var botServer = http.createServer(function(request, response) {
		req.headers.host = this.url;
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
				self.emit('serverMessage', self, {
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
	botServer.listen(address);
}

function acceptableLoc(loc) {
	for (var i = 0; i < this.locs.length; i++) {
		if (this.locs[i].indexOf(loc) > -1) {
			return true;
		}
	};
	return false;
}

module.exports = BotServer;
