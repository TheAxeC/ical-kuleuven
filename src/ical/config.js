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
	}
};

config.users = {
	'axel' : {
		'51230411-2017-2-1' : [
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
							]
	}
};

module.exports = config
