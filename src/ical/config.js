var config = {}

config.current_semester = '1';

config.group_list = {
	'vincent' : {
		'H0N06A' : ['1McsB', '1McsC+Mti'] // Digitale Elektronica en Processoren
	}
};

config.users = {
	'axel' : {
		'51016880-2018-1-2' : [
								'H00G8a', 'H02C4a', // Artificial Neural Networks and Deep Learning
							],
		'50046420-2018-1-1' : [
								'C00K2a', // Research Integrity for Starting PhD Researchers
							],
		'50046420-2018-1-2' : [
								'C00K2a', // Research Integrity for Starting PhD Researchers
							],
	},
	'vincent' : {
		'51230411-2018-1-1' : [
						'G0B23A', 'G0B24A', 'G0B25A', //Modellering van complexe systemen
						'H00K1A', 'H03K2A' // Engineering Economy
						],
		'52364422-2018-1-1' : [
						'H0N05a', 'H0N06A', 'H0N07a', // Modelling of complex systems
						],
		
	}
};

module.exports = config