// seeder/seeder.js

const seeder 	= require('mongoose-seed');
const env 		= process.env.NODE_ENV || 'development';
const config 	= require('../config/server')[env];
const mongooseConfig = require('../config/mongoose');
const dotenv  = require('dotenv');
const fs 		= require('fs');
const { getArgs, isObject, isEmpty } = require('../helpers/helpers');

dotenv.config();

const seedsPath = './seeder/seeds/';
const args = getArgs();

fs.readdir(seedsPath, function(err, filenames) {
    
  if (err) {
    console.log('Error reading files: ' + err)
    return;
  }

  let models = {
  	data: [],
  	names: [],
  	paths: []
  }

  if(isObject(args) && !isEmpty(args) && args.models){
  	filenames = args.models.split(',');
  	filenames.forEach(function(filename, index) {
		  this[index] = `${filename}.json`;
		}, filenames); // use arr as this
  }

  console.log(filenames);

  var promise = new Promise((resolve, reject) => {
  	filenames.forEach(function(filename, index, array) {
			let data = require(`.${seedsPath}${filename}`);
			models.data.push(data);
			models.paths.push('models/' + data['model'] + '.js');
			models.names.push(data['model']);
			if (index === array.length -1) resolve();
			
		});
	});

	promise.then(() => {

		seeder.connect(process.env["database_connection_string_" + env], mongooseConfig, (err) => {

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



