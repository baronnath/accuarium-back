// seeder/seeder.js

const seeder 	= require('mongoose-seed');
const env 		= process.env.NODE_ENV || 'development';
const config 	= require('../config/server')[env];
const fs 		= require('fs');

fs.readdir('./seeder/seeds', function(err, filenames) {
    
    if (err) {
      console.log('Error reading files: ' + err)
      return;
    }

    let models = {
    	data: [],
    	names: [],
    	paths: []
    }

    var promise = new Promise((resolve, reject) => {
    	filenames.forEach(function(filename, index, array) {
			let data = require('../seeder/seeds/' + filename);
			models.data.push(data);
			models.paths.push('models/' + data['model'] + '.js');
			models.names.push(data['model']);
			if (index === array.length -1) resolve();
			
		});
	});

	promise.then(() => {

		seeder.connect(config['connectionString'], (err) => {

			if(err){
				return console.log('Connection failed: ' + err);
			}

			seeder.loadModels(models.paths);

		    seeder.clearModels(models.names, () => {

				seeder.populateModels(models.data, (err) => {
					
					if(err){
						return console.log('Seeding error: ' + err);
					}

					seeder.disconnect();
					console.log('Seeding completed');
				});
			});

	    });
    });

});



