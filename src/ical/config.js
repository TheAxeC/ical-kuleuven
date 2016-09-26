var config = {}
config.cron = '59 23 * * *';
config.ttl_ical = 60*60;

config.port = 8008;

config.url = 'http://www.kuleuven.be/sapredir/uurrooster/keuze_studiejaar.htm';
config.year_url =  'SEL_JAAR=';
config.phase_url = 'STUDIEJAAR='; 
config.id_url = 'OBJID_SC=';

config.users = {
	'theaxec' : {
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
							]
	}
};

module.exports = config
