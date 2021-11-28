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
      await expect(unitConverter(1, 'hardness', 'ppm')).resolves.toEqual(1);
      await expect(unitConverter(1, 'hardness', 'ppm', 'ppm')).resolves.toEqual(1);
      await expect(unitConverter(1, 'hardness', 'ppm', 'mg')).resolves.toEqual(1);
      await expect(unitConverter(1, 'hardness', 'ppm', 'µS')).resolves.toEqual(1.56);
      await expect(unitConverter(1, 'hardness', 'ppm', 'gH')).resolves.toEqual(0.06);

      // Secondary units conversion
      await expect(unitConverter(1, 'hardness', 'gH', 'mg')).resolves.toEqual(17.86);
      await expect(unitConverter(1, 'hardness', 'mg', 'gH')).resolves.toEqual(0.06);
      await expect(unitConverter(1, 'hardness', 'gH', 'µS')).resolves.toEqual(27.86);
    });

    test("Test volume conversion", async () => {
      // Base unit conversion
      await expect(unitConverter(1, 'volume', 'liter', 'liter')).resolves.toEqual(1);
      await expect(unitConverter(1, 'volume', 'liter', 'm3')).resolves.toEqual(0);
      await expect(unitConverter(1, 'volume', 'liter', 'gallon')).resolves.toEqual(0.26);
      await expect(unitConverter(1, 'volume', 'liter', 'ounce')).resolves.toEqual(33.81);

      // Secondary units conversion
      await expect(unitConverter(1, 'volume', 'm3', 'gallon')).resolves.toEqual(264.2);
      await expect(unitConverter(1, 'volume', 'gallon', 'ounce')).resolves.toEqual(127.99);
      await expect(unitConverter(1, 'volume', 'ounce', 'liter')).resolves.toEqual(0.03);
      await expect(unitConverter(1, 'volume', 'ounce')).resolves.toEqual(0.03);
    });

    test("Test length conversion", async () => {
      // Base unit conversion
      await expect(unitConverter(1, 'length', 'cm', 'cm')).resolves.toEqual(1);
      await expect(unitConverter(1, 'length', 'cm', 'm')).resolves.toEqual(0.01);
      await expect(unitConverter(1, 'length', 'cm', 'mm')).resolves.toEqual(10);
      await expect(unitConverter(1, 'length', 'cm', 'in')).resolves.toEqual(0.39);
      await expect(unitConverter(1, 'length', 'cm', 'ft')).resolves.toEqual(0.03);

      // Secondary units conversion
      await expect(unitConverter(1, 'length', 'm', 'in')).resolves.toEqual(39.37);
      await expect(unitConverter(1, 'length', 'ft', 'mm')).resolves.toEqual(304.8);
      await expect(unitConverter(1, 'length', 'in', 'ft')).resolves.toEqual(0.08);
    });

    test("Test temperature conversion", async () => {
      // Base unit conversion
      await expect(unitConverter(1, 'temperature', 'celsius', 'celsius')).resolves.toEqual(1);
      await expect(unitConverter(1, 'temperature', 'celsius', 'fahrenheit')).resolves.toEqual(33.8);
      await expect(unitConverter(1, 'temperature', 'celsius', 'kelvin')).resolves.toEqual(274.15);

      // Secondary units conversion
      await expect(unitConverter(1, 'temperature', 'fahrenheit', 'kelvin')).resolves.toEqual(255.93);
      await expect(unitConverter(1, 'temperature', 'fahrenheit', 'celsius')).resolves.toEqual(-17.22);
      await expect(unitConverter(1, 'temperature', 'kelvin', 'fahrenheit')).resolves.toEqual(-457.87);
      await expect(unitConverter(1, 'temperature', 'fahrenheit')).resolves.toEqual(-17.22);
    });


  });
