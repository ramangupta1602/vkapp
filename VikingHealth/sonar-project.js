const sonarqubeScanner = require('sonarqube-scanner');
	sonarqubeScanner(
  	{
    	serverUrl: 'http://localhost:9000',
       	options: {
		'sonar.projectKey':'viking-mobile',
		'sonar.projectName':'viking-mobile',
		'sonar.sourceEncoding':'UTF-8',
		'sonar.javascript.file.suffixes':'.js,.jsx',
             	'sonar.sources': 'src',
             	'sonar.inclusions' : '**', 
       		},
   	},
   	() => {},
	);
	
