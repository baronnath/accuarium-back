// test/controllers/unitConverter.test.js

const unitConverter = require(__dirname + "/../../helpers/unitConverter");

// Login
describe("unitConverter", () => {
    test("Invalid input", async () => {
      expect.assertions(2);
      await expect(unitConverter('lengt', 'cm', 'ft', 1)).rejects.toThrowError("measure.notFound");
      await expect(unitConverter('length', 'cms', 'ft', 1)).rejects.toThrowError("unit.notFound");
    });

    test("Test water hardness conversion", async () => {
      // Base unit conversion
      await expect(unitConverter('hardness', 'ppm', 'ppm', 1)).resolves.toEqual(1);
      await expect(unitConverter('hardness', 'ppm', 'mg', 1)).resolves.toEqual(1);
      await expect(unitConverter('hardness', 'ppm', 'µS', 1)).resolves.toEqual(1.56);
      await expect(unitConverter('hardness', 'ppm', 'gh', 1)).resolves.toEqual(0.06);

      // Secondary units conversion
      await expect(unitConverter('hardness', 'gh', 'mg', 1)).resolves.toEqual(17.86);
      await expect(unitConverter('hardness', 'mg', 'gh', 1)).resolves.toEqual(0.06);
      await expect(unitConverter('hardness', 'gh', 'µS', 1)).resolves.toEqual(27.86);
    });

    test("Test volume conversion", async () => {
      // Base unit conversion
      await expect(unitConverter('volume', 'liter', 'liter', 1)).resolves.toEqual(1);
      await expect(unitConverter('volume', 'liter', 'm3', 1)).resolves.toEqual(0);
      await expect(unitConverter('volume', 'liter', 'gallon', 1)).resolves.toEqual(0.26);
      await expect(unitConverter('volume', 'liter', 'ounce', 1)).resolves.toEqual(33.81);

      // Secondary units conversion
      await expect(unitConverter('volume', 'm3', 'gallon', 1)).resolves.toEqual(264.2);
      await expect(unitConverter('volume', 'gallon', 'ounce', 1)).resolves.toEqual(127.99);
      await expect(unitConverter('volume', 'ounce', 'liter', 1)).resolves.toEqual(0.03);
    });

    test("Test length conversion", async () => {
      // Base unit conversion
      await expect(unitConverter('length', 'cm', 'cm', 1)).resolves.toEqual(1);
      await expect(unitConverter('length', 'cm', 'm', 1)).resolves.toEqual(0.01);
      await expect(unitConverter('length', 'cm', 'mm', 1)).resolves.toEqual(10);
      await expect(unitConverter('length', 'cm', 'in', 1)).resolves.toEqual(0.39);
      await expect(unitConverter('length', 'cm', 'ft', 1)).resolves.toEqual(0.03);

      // Secondary units conversion
      await expect(unitConverter('length', 'm', 'in', 1)).resolves.toEqual(39.37);
      await expect(unitConverter('length', 'ft', 'mm', 1)).resolves.toEqual(304.8);
      await expect(unitConverter('length', 'in', 'ft', 1)).resolves.toEqual(0.08);
    });

    test("Test temperature conversion", async () => {
      // Base unit conversion
      await expect(unitConverter('temperature', 'celsius', 'celsius', 1)).resolves.toEqual(1);
      await expect(unitConverter('temperature', 'celsius', 'fahrenheit', 1)).resolves.toEqual(33.8);
      await expect(unitConverter('temperature', 'celsius', 'kelvin', 1)).resolves.toEqual(274.15);

      // Secondary units conversion
      await expect(unitConverter('temperature', 'fahrenheit', 'kelvin', 1)).resolves.toEqual(255.93);
      await expect(unitConverter('temperature', 'fahrenheit', 'celsius', 1)).resolves.toEqual(-17.22);
      await expect(unitConverter('temperature', 'kelvin', 'fahrenheit', 1)).resolves.toEqual(-457.87);
    });


  });
