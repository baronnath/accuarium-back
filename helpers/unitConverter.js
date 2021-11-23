// helpers/unitConverter.js

const {	ErrorHandler } = require('./errorHandler');

const properties = {
    hardness: {
        units: ['ppm', 'mg', 'µS',  'gh'],
        factor: [1, 1, .5, 17.86 ]
    },
    volume: {
        units: ['liter', 'm3', 'gallon', 'ounce'],
        factor: [1, 1000, 3.78504, 0.0295735]
    },
    length: {
        units: ['cm', 'm', 'mm', 'in', 'ft'],
        factor: [1, 100, 0.1, 2.54, 30.48]
    },
    temperature: {
        units: ['celsius', 'fahrenheit', 'kelvin'],
        factor: [1, 0.555555555555, 1],
        increment: [0, -32, -273.15],
    },
}

module.exports = (measure, from, to, value) => {

    return new Promise(function (resolve, reject) {

        // Check that "measure" is valid
        if(!properties.hasOwnProperty(measure))
            reject(new ErrorHandler(400, 'measure.notFound'));
        
        // Check that "to" unit is valid
        if(properties[measure].units.indexOf(from) < 0 || properties[measure].units.indexOf(to) < 0)
            reject(new ErrorHandler(400, 'unit.notFound'));

        // Determine the conversion factor
        let fromIndex = properties[measure].units.indexOf(from);
        let fromFactor = properties[measure].factor[fromIndex];

        let toIndex = properties[measure].units.indexOf(to);
        let toFactor = properties[measure].factor[toIndex];

        // Convert to the base (main) unit to make easier the conversion to any other unit
        // (temperature needs an increment)
        if(measure == 'temperature')
            value = value + properties[measure].increment[fromIndex];
        
        value = value * fromFactor;

        // Final conversion
        // (temperature needs an increment)
        value = value / toFactor;

        if(measure == 'temperature')
            value = value - properties[measure].increment[toIndex];

        resolve(value);
    });
}