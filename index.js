var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

var nicknames = {};

io.on('connection', function (socket) {
	nicknames[socket.id] = nextGuestName();
	
	socket.on('chat message', function (msg) {
		if (msg[0] === "/") {
			nicknames[socket.id] = msg.slice(1);
		} else {
			io.emit('chat message', nicknames[socket.id] + ": " + msg);
		}
	});
	
	socket.on('disconnect', function () {
		io.emit('chat message', "user disconnected");
		console.log("user disconnected");
	});
});

var nextGuestName = (function () {
	var guestNumber = 1;
	return function () {
		return "Guest" + guestNumber++;
	};
}());

http.listen(80, function () {
	console.log("Listening on *:80");
});