var http = require('http');
var fs = require('fs');
var path = require('path');
var urlparser = require('url');

var config = require('./config')

function canServe(filename, request) {
	return( request.method === "GET" && (filename.indexOf(__dirname) === 0) && fs.existsSync(filename) && fs.statSync(filename).isFile() );
}

function handleRequest(request, response) {
	var parsedUrl = urlparser.parse(request.url);
	var filename = path.join(__dirname, parsedUrl.pathname);
	if(!canServe(filename, request)) {
		response.writeHead('404');
		response.end();
		return;
	}

	if (filename.endsWith('.ics')) {
		response.setHeader('Content-disposition', 'attachment; filename='+path.basename(parsedUrl.pathname));
	}
	
	response.writeHead(200, cacheHeader);
	response.write( fs.readFileSync(filename) );
	response.end();
}

module.exports.startServer = function() {
	console.log('Starting server on port: ' + config.port);
	var server = http.createServer( function(req,res) { handleRequest(req, res); });
	server.listen(config.port);
}
