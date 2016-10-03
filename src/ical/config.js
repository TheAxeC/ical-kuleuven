var config = {}
config.cron = '59 23 * * *';
config.ttl_ical = 60*60;

config.port = 8008;

config.url = 'http://www.kuleuven.be/sapredir/uurrooster/keuze_studiejaar.htm';
config.year_url =  'SEL_JAAR=';
config.phase_url = 'STUDIEJAAR='; 
config.id_url = 'OBJID_SC=';

config.group_list = {
	'axel' : {
		'H00H2A' : 'Group A', // Uncertainty in Artificial Intelligence
		'H0N06A' : '1McsA', // Modellering van complexe systemen
		'H0N09A' : '1McsA', // Gedistribueerde systemen
		'G0Q58a' : 'Group A', // Modellering en simulatie
		'H00G6A' : 'Group B' // Machine Learning and Inductive Inference
	},
	'luuk' : {
		'H0N06A' : '1McsA', // Modellering van complexe systemen
		'H00G6A' : 'Group B' // Machine Learning and Inductive Inference	
	}
};

config.users = {
	'axel' : {
		'51230411-2016-1-1' : [
								'H01F2A', 'H01F3A', // Bedrijfskunde & Entrepreneurship
								'G0Q57a', 'G0Q58a', // Modellering en simulatie
								'H04I4A', 'H04I5A', 'H04I6A', // Gedistribueerde systemen
								'G0B23A', 'G0B24A', 'G0B25A', // Modellering van complexe systemen
								'H00G6A', 'H02C1A', // Machine Learning and Inductive Inference
								'H00H2A', 'H02D2A', 'H08M4A' // Uncertainty in Artificial Intelligence
							],
		'51230411-2016-1-2' : [
								'H01L1A', 'H01L2A', // Digitale elektronica en processoren
								'H09B5A', 'H09B6A', // Software architectuur
								'H09P5A', 'H09P8A', 'H0T37A', 'H0T38A', // Engineering & Entrepreneurship
								'G0B01A', // Intellectual Property Management
								'H02A8A', 'H02K8A', // Advanced Programming Languages for A.I.
							],
		'51016880-2016-1-1' : [
								'H02B3A', 'H00G2A' // Neural computing  
							],  
		'51016880-2016-1-2' : [
								'H08M0A', 'H08M1A', // Brain-computer interfaces
								'H02H6A' // Bio-informatics
							],
		'52364422-2016-1-1' : [
								'H0N05A', 'H0N06A', 'H0N07A', // Modelling of Complex Systems
								'H0N08A', 'H0N09A', 'H0N10A' // Distributed Systems
							],
		'52364422-2016-1-2' : [
								'H07Z9A', 'H0S00A' // Software Architecture
							]
	},
	'luuk' : {
		'51230411-2016-1-1' : [
								'H01F2A', 'H01F3A', // Bedrijfskunde & Entrepreneurship
								'G0Q57a', 'G0Q58a', // Modellering en simulatie
								'H04I4A', 'H04I5A', 'H04I6A', // Gedistribueerde systemen
								'G0B23A', 'G0B24A', 'G0B25A', //Modellering van complexe systemen
								'H00G6A', 'H02C1A', // Machine Learning and Inductive Inference
								'H04K5a', 'H04K6a' // Development of secure software
							],
		'52364422-2016-1-1' : [
								'H0N08a','H0N09a','H0N10a', // distributed systems
								'H0N05a', 'H0N06a', 'H0N07a', // Modelling of complex systems
		],
		'51230411-2016-1-2' : [
								'H01L1A', 'H01L2A', // Digitale elektronica en processoren
								'H09B5A', 'H09B6A', // Software Architectuur
								
								'H00I0A', 'H02C6A', 'HMI08B',// data mining
								'H09P5A', 'H09P8A', 'H0T37A', 'H0T38A', // Engineering & Entrepreneurship
								'G0B01A', // Intellectual Property Management
								'H00I2A', 'H02H4A', 'H08M2A' // multi-agent sytems
							],
		'52364422-2016-1-2' : [
								'H07Z9a', 'H0S00a', // Software Architecture
		],
	}
};

module.exports = config
