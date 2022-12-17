// helpers/helpers.js
const fs = require('fs');
const { ErrorHandler } = require('./errorHandler');
const urlGenerator = require('./urlGenerator');

// Check if object
exports.isObject = (input) => {
  if (input === null || input === undefined) return false;
  return input === Object(input);
}

// Check empty object
exports.isEmpty = (object) => {
  return _.isEmpty(object);
}

// Check if string
exports.isString = (string) => {
	if(typeof string === 'string')
	  return true;
	else
	  return false;
}

// Check if array
exports.isArray = (input) => {
  return !!input && input.constructor === Array;
}

// Capitalize first string letter 
exports.ucFirst = (string) =>  {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Delete object properties
exports.deleteProps = (obj, prop) => {
    for (const p of prop) {
        (p in obj) && (delete obj[p]);
    }    
}

// Round decimals
// use example:
// 		round.round(5.62, 1); --> 5.6 
// 		round.floo(5.12, 2);  --> 5.10  
exports.round = (function() {
  if (Number.EPSILON === undefined) {
      Number.EPSILON = Math.pow(2, -52);
  }
  if (Math.trunc === undefined) {
      Math.trunc = function(v) {
          return v < 0 ? Math.ceil(v) : Math.floor(v);
      };
  }
  var isRound = function(num, decimalPlaces) {
      //return decimalPlaces >= 0 &&
      //    +num.toFixed(decimalPlaces) === num;
      var p = Math.pow(10, decimalPlaces);
      return Math.round(num * p) / p === num;
  };
  var decimalAdjust = function(type, num, decimalPlaces) {
      if (isRound(num, decimalPlaces || 0))
          return num;
      var p = Math.pow(10, decimalPlaces || 0);
      var n = (num * p) * (1 + Number.EPSILON);
      return Math[type](n) / p;
  };
  return {
      // Decimal round (half away from zero)
      round: function(num, decimalPlaces) {
          return decimalAdjust('round', num, decimalPlaces);
      },
      // Decimal ceil
      ceil: function(num, decimalPlaces) {
          return decimalAdjust('ceil', num, decimalPlaces);
      },
      // Decimal floor
      floor: function(num, decimalPlaces) {
          return decimalAdjust('floor', num, decimalPlaces);
      },
      // Decimal trunc
      trunc: function(num, decimalPlaces) {
          return decimalAdjust('trunc', num, decimalPlaces);
      },
      // Format using fixed-point notation
      toFixed: function(num, decimalPlaces) {
          return decimalAdjust('round', num, decimalPlaces).toFixed(decimalPlaces);
      },
      // Up or down to the nearest 5 multiple
      nearest5: function(num) {
          return Math.round(num / 5) * 5;
      }
  };
})();

// debug var into file
exports.debug = (input, array = false) => {

  let path = urlGenerator.getPrivatePath() + 'debug.txt';
  let file = fs.createWriteStream(path);

  file.on('error', function(err) { throw new ErrorHandler(400, err) });

  if(array)
    input.forEach(value => file.write(JSON.stringify(value)+'\n'));
  else
    fs.write(path, JSON.stringify(input));

  file.end();
}