var SCOPES = ['https://www.googleapis.com/auth/calendar'];
var TOKEN_DIR = __dirname + '/secrets/';
var TOKEN_PATH = TOKEN_DIR + 'token.json';
var CLIENT_SECRET = TOKEN_DIR + 'client_secret.json';

var CALENDAR_ID = {
	'axel' : '93lt68p28ta7d6mf0ab2ju1j6o@group.calendar.google.com'
}

module.exports.SCOPES = SCOPES;
module.exports.TOKEN_DIR = TOKEN_DIR;
module.exports.TOKEN_PATH = TOKEN_PATH;
module.exports.CLIENT_SECRET = CLIENT_SECRET;
module.exports.CALENDAR_ID = CALENDAR_ID;
