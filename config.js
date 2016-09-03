

var config = {}
config.cron = '59 23 * * *';
config.ttl_ical = 60*60;

config.port = 8008;

config.url = 'http://www.kuleuven.be/sapredir/uurrooster/keuze_studiejaar.htm';
config.year_url =  'SEL_JAAR=';
config.phase_url = 'STUDIEJAAR='; 
config.id_url = 'OBJID_SC=';

config.users = {
	'axel' : {
		'51230411-2016-1-1' : [
		 					'G0Q57a',
		 					'H01F2A',
		 					'H04I4A',
		 					'G0B23A',
		 					'H02C1A',
		 					'H04K5A',
		 					'H04H8A'
		 						],
		'51230411-2016-1-2' : [
		 					'H01L1A',
		 					'H09B5A',
		 					'H04E0A',
		 					'H02A8A',
		 					'G0Q63A'
		 						],
		'51230411-2016-2-2' : [
		 					'H05D9A'
		 						],
		 // '51230411-2017-2-1' : [
		 // 					'H04L5A',
		 // 					'H05N0A',
		 // 					'H03F9A',
		 // 					'H03F0B',
		 // 					'H02D1A'
		 // 						],
		 // '51230411-2017-2-2' : [
		 // 					'G0U12B',
		 // 					'G0O00A',
		 // 					'H05N0A',
		 // 					'H04G4A'
		 // 						],
		 '51016880-2016-1-1' : [
		 					'H02B3A'
								],
		 '51016880-2016-1-2' : [
 							'H08M0A'
								]
	}
};


module.exports = config

// https://peter.verraedt.be/uurrooster_kuleuven
// https://github.com/mosterdt/kulender
// http://www.horsemanjs.org/
// https://github.com/johntitus/node-horseman
// https://github.com/johntitus/node-horseman/issues/106
