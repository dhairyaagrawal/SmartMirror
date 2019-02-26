// A very basic web server in node.js
// Found in: Node.js for Front-End Developers by Garann Means (p. 9-10)

var port = 3000;
var serverUrl = "127.0.0.1";

var http = require("http");
var path = require("path");
var fs = require("fs");
var checkMimeType = true;

var cpu_data = "VERY IMPORTANT CPU DATA";

console.log("Starting web server at " + serverUrl + ":" + port);

http.createServer( function(req, res) {

	var now = new Date();
	//console.log("REQUEST: " + req.url);

	if (req.url == "/") {
		var filename = "/index.html";
	} else {
		var filename = req.url;
	}
	//var filename = req.url || "index.html";
	//var filename = "index.html";
	var ext = path.extname(filename);
	console.log("EXTENSION: " + ext);
	var localPath = __dirname;
	console.log("LOCAL PATH: " + localPath);
	var validExtensions = {
		".html" : "text/html",
		".js": "application/javascript",
		".css": "text/css",
		".txt": "text/plain",
		".json": "application/json",
		".jpg": "image/jpeg",
		".gif": "image/gif",
		".png": "image/png",
		".woff": "application/font-woff",
		".woff2": "application/font-woff2"
	};

	var validMimeType = true;
	var mimeType = validExtensions[ext];
	if (checkMimeType) {
		validMimeType = validExtensions[ext] != undefined;
	}

	if (validMimeType) {
		localPath += filename;
		fs.exists(localPath, function(exists) {
			if(exists) {
				//console.log("Serving file: " + localPath);
				getFile(localPath, res, mimeType);
			} else {
				console.log("File not found: " + localPath);
				res.writeHead(404);
				res.end();
			}
		});

	} else {
		console.log("Invalid file extension detected: " + ext + " (" + filename + ")")
	}

}).listen(port, serverUrl);

function getFile(localPath, res, mimeType) {
	fs.readFile(localPath, function(err, contents) {
		if(!err) {
			res.setHeader("Content-Length", contents.length);
			if (mimeType != undefined) {
				res.setHeader("Content-Type", mimeType);
			}
			res.statusCode = 200;
			res.end(contents);
		} else {
			res.writeHead(500);
			res.end();
		}
	});
}