var config = {}

config.current_semester = '1';

config.group_list = {
	'axel' : {
		'H00H2A' : 'Group A', // Uncertainty in Artificial Intelligence
		'H0N06A' : '1McsA', // Modellering van complexe systemen
		'H0N09A' : '1McsA', // Gedistribueerde systemen
		'G0Q58a' : 'Group A', // Modellering en simulatie
		'H00G6A' : 'Group B', // Machine Learning and Inductive Inference
		'G0Q58A' : 'Group A', // Modellering en simulatie
		'H0S00A' : '1McsA', // Software architecture
		'H01L2A' : 'McwsBinfB' // Digitale elektronica en processoren
	}//,
	// 'luuk' : {
	// 	'H0N06A' : '1McsA', // Modellering van complexe systemen
	// 	'H00G6A' : 'Group B', // Machine Learning and Inductive Inference
	// 	'H0S00A' : '1McsA', // Software architecture
	// 	'H00I2A' : 'Group B', // Multi-agent systems
	// 	'H00I0A' : 'Group B', // Data Mining
	// 	'H01L2A' : 'McwsBinfA' // Digitale elektronica en processoren
	// }
};

config.users = {
	'axel' : {
		'51230411-2017-1-1' : [
								'H00H1a', 'H02D1a', 'H08M3a', // Genetic Algorithms and Evolutionary Computing
								'H00K2a', 'H03K3a', // Management and Information Technology
								'H04L5a', 'H04L6a', 'H09P6a', // Vergelijkende studie van imperatieve programmeertalen
								'H03F0a', 'H0T45a', // Technisch-wetenschappelijke software
								'H03F9a', 'H03G0a', // Parallel Computing
								'H05N0a' // Capita Selecta Computer Science: Artificial Intelligence
							],
		'51230411-2017-1-2' : [
								'H05N0a' // Capita Selecta Computer Science: Artificial Intelligence
							],
		'51016880-2017-1-1' : [
								'H00I6a', 'H00I7a', 'H02A0a', 'H02K1a' // 	Fundamentals of Artificial Intelligence
							],
		'51016880-2017-1-2' : [
								'H02D5a', // Philosophy of Mind and Artificial Intelligence
								'H00G8a', 'H02C4a', // Artificial Neural Networks
								'H00H3a', 'H02D3a' // Support Vector Machines: Methods and Applications
							],
		'52364422-2017-1-2' : [
								'H0S01a', 'H0S02a', 'H0S03a', // Comparative Programming Languages
							]
	}//,
	// 'luuk' : {
	// 	'51230411-2016-1-1' : [
	// 							'H01F2A', 'H01F3A', // Bedrijfskunde & Entrepreneurship
	// 							'G0Q57a', 'G0Q58a', // Modellering en simulatie
	// 							'H04I4A', 'H04I5A', 'H04I6A', // Gedistribueerde systemen
	// 							'G0B23A', 'G0B24A', 'G0B25A', //Modellering van complexe systemen
	// 							'H00G6A', 'H02C1A', // Machine Learning and Inductive Inference
	// 							'H04K5a', 'H04K6a' // Development of secure software
	// 						],
	// 	'52364422-2016-1-1' : [
	// 							'H0N08a','H0N09a','H0N10a', // distributed systems
	// 							'H0N05a', 'H0N06a', 'H0N07a', // Modelling of complex systems
	// 	],
	// 	'51230411-2016-1-2' : [
	// 							'H01L1A', 'H01L2A', // Digitale elektronica en processoren
	// 							'H09B5A', 'H09B6A', // Software Architectuur
	//
	// 							'H00I0A', 'H02C6A', 'HMI08B',// data mining
	// 							'H09P5A', 'H09P8A', 'H0T37A', 'H0T38A', // Engineering & Entrepreneurship
	// 							'G0B01A', // Intellectual Property Management
	// 							'H00I2A', 'H02H4A', 'H08M2A' // multi-agent sytems
	// 						],
	// 	'52364422-2016-1-2' : [
	// 							'H07Z9a', 'H0S00a', // Software Architecture
	// 	],
	// }
};

module.exports = config
