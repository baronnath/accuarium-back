// controllers/index.js

const fs = require('fs');
var path = require('path');

require('fs').readdirSync(__dirname).forEach(function (file) {

  	if (file === 'index.js') // If its the current file ignore it
 		return;

 	// Store module with its name (from filename minus 'Controller')
  	module.exports[path.basename(file, '.js').replace('Controller', '')] = require(path.join(__dirname, file));

});