// test/controllers/unitConverter.test.js

const unitConverter = require(__dirname + "/../../helpers/unitConverter");

// Login
describe("unitConverter", () => {
    test("Invalid input", async () => {
      expect.assertions(2);
      await expect(unitConverter(1, 'lengt', 'cm', 'ft')).rejects.toThrowError("measure.notFound");
      await expect(unitConverter(1, 'length', 'cms', 'ft')).rejects.toThrowError("unit.notFound");
    });

    test("Test water hardness conversion", async () => {
      // Base unit conversion
      await expect(unitConverter(1, 'hardness', 'ppm')).resolves.toEqual(0);
      await expect(unitConverter(4, 'hardness', 'ppm')).resolves.toEqual(5);
      await expect(unitConverter(5, 'hardness', 'ppm')).resolves.toEqual(5);
      await expect(unitConverter(7, 'hardness', 'ppm')).resolves.toEqual(5);
      await expect(unitConverter(8, 'hardness', 'ppm')).resolves.toEqual(10);
      await expect(unitConverter(10, 'hardness', 'ppm', 'ppm')).resolves.toEqual(10);
      await expect(unitConverter(10, 'hardness', 'ppm', 'mg')).resolves.toEqual(10);
      await expect(unitConverter(1, 'hardness', 'ppm', 'µS')).resolves.toEqual(1.6);
      await expect(unitConverter(1, 'hardness', 'ppm', 'gH')).resolves.toEqual(0.1);

      // Secondary units conversion
      await expect(unitConverter(1, 'hardness', 'gH', 'mg')).resolves.toEqual(20);
      await expect(unitConverter(1, 'hardness', 'mg', 'gH')).resolves.toEqual(0.1);
      await expect(unitConverter(1, 'hardness', 'gH', 'µS')).resolves.toEqual(27.9);
    });

    test("Test volume conversion", async () => {
      // Base unit conversion
      await expect(unitConverter(1, 'volume', 'liter', 'liter')).resolves.toEqual(1);
      await expect(unitConverter(1, 'volume', 'liter', 'm3')).resolves.toEqual(0);
      await expect(unitConverter(1, 'volume', 'liter', 'gallon')).resolves.toEqual(0.3);
      await expect(unitConverter(1, 'volume', 'liter', 'ounce')).resolves.toEqual(33.8);

      // Secondary units conversion
      await expect(unitConverter(1, 'volume', 'm3', 'gallon')).resolves.toEqual(264.2);
      await expect(unitConverter(1, 'volume', 'gallon', 'ounce')).resolves.toEqual(128);
      await expect(unitConverter(10, 'volume', 'ounce', 'liter')).resolves.toEqual(0.3);
      await expect(unitConverter(10, 'volume', 'ounce')).resolves.toEqual(0.3);
    });

    test("Test length conversion", async () => {
      // Base unit conversion
      await expect(unitConverter(1, 'length', 'cm', 'cm')).resolves.toEqual(1);
      await expect(unitConverter(10, 'length', 'cm', 'm')).resolves.toEqual(0.1);
      await expect(unitConverter(1, 'length', 'cm', 'mm')).resolves.toEqual(10);
      await expect(unitConverter(1, 'length', 'cm', 'in')).resolves.toEqual(0.4);
      await expect(unitConverter(10, 'length', 'cm', 'ft')).resolves.toEqual(0.3);

      // Secondary units conversion
      await expect(unitConverter(1, 'length', 'm', 'in')).resolves.toEqual(39.4);
      await expect(unitConverter(1, 'length', 'ft', 'mm')).resolves.toEqual(304.8);
      await expect(unitConverter(1, 'length', 'in', 'ft')).resolves.toEqual(0.1);
    });

    test("Test temperature conversion", async () => {
      // Base unit conversion
      await expect(unitConverter(1, 'temperature', 'celsius', 'celsius')).resolves.toEqual(1);
      await expect(unitConverter(1, 'temperature', 'celsius', 'fahrenheit')).resolves.toEqual(33.8);
      await expect(unitConverter(1, 'temperature', 'celsius', 'kelvin')).resolves.toEqual(274.2);

      // Secondary units conversion
      await expect(unitConverter(1, 'temperature', 'fahrenheit', 'kelvin')).resolves.toEqual(255.9);
      await expect(unitConverter(1, 'temperature', 'fahrenheit', 'celsius')).resolves.toEqual(-17.2);
      await expect(unitConverter(1, 'temperature', 'kelvin', 'fahrenheit')).resolves.toEqual(-457.9);
      await expect(unitConverter(1, 'temperature', 'fahrenheit')).resolves.toEqual(-17.2);
    });


  });
