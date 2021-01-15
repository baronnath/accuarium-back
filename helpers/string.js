// helpers/stringy.js

// Check if object
exports.isObject = (input) => {
  if (input === null || input === undefined) return false;
  return Object.getPrototypeOf(input).isPrototypeOf(Object);
}

// Capitalize first string letter 
exports.ucFirst = (string) =>  {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Check if string
exports.isString = (string) => {
	if(typeof string === 'string')
	  return true;
	else
	  return false;
}
