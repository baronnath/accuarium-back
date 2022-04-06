// test/services/compatibilityService.test.js

const mongoose = require("mongoose");
const { update } = require("../../models/species");
const mongooseConfig = require(__dirname + "/../../config/mongoose");
const { functionsToTest: compatibilityService } = require(__dirname + "/../../services/compatibilityService");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../../config/server")[env];
const { mockRequest, mockResponse, mockNext } = require(__dirname + "/../mocks.js");

beforeAll(async () => {
  await mongoose.connect(config["connectionString"], mongooseConfig);
});

// Close the connection
afterAll(async () => {
  await mongoose.connection.close();
});

let rangeA, rangeB = {};
let speciesA, speciesB = null;

describe("isParameterCompatible", () => {
  test("Compatible parameters", () => {
    rangeA = {
      min: 0,
      max: 15
    };
    rangeB = {
      min: 3,
      max: 18
    };

    let res = compatibilityService.isParameterCompatible(rangeA, rangeB);
    expect(res).toBe(true);
  });

  test("Not compatible parameters", () => {
    rangeA = {
      min: 0,
      max: 8
    };
    rangeB = {
      min: 9,
      max: 18
    };

    let res = compatibilityService.isParameterCompatible(rangeA, rangeB);
    expect(res).toBe(false);
  });

  test("Not defined parameters", () => {
    rangeA, rangeB = {};

    let res = compatibilityService.isParameterCompatible(rangeA, rangeB);
    expect(res).toBe(null);
  });

  test("Range parameters are zero", () => {
    rangeA = rangeB = {
      min: 0,
      max: 0
    };

    let res = compatibilityService.isParameterCompatible(rangeA, rangeB);
    expect(res).toBe(null);
  });

  test("Range parameters for speciesA is zero", () => {
    rangeA = {
      min: 0,
      max: 0
    };

    rangeB = {
      min: 9,
      max: 18
    };

    let res = compatibilityService.isParameterCompatible(rangeA, rangeB);
    expect(res).toBe(null);
  });

  test("Min. range is zero", () => {
    rangeA = rangeB = {
      min: 0,
      max: 15
    };

    let res = compatibilityService.isParameterCompatible(rangeA, rangeB);
    expect(res).toBe(true);
  });

});


describe("getInterpeciesCompatibility", () => {
  speciesA = '5e8cdd3b8296523464c7462a';
  speciesB = '5e8cdd3b8296523464c7462b';

  test("No compatibility", async() => {
    expect(await compatibilityService.getInterpeciesCompatibility([speciesA, speciesB]))
      .toMatchObject({
        "5e8cdd3b8296523464c7462a": {
          "5e8cdd3b8296523464c7462b": {
            "compatibility": 0, "warnings": expect.anything()
          }
        },
        "5e8cdd3b8296523464c7462b": {
          "5e8cdd3b8296523464c7462a": {
            "compatibility": 0, "warnings": expect.anything()
          }
        }
      });
  });

  test("Regular compatibility", async() => {
    speciesA = '5e8cdd3b8296523464c7462a';
    speciesB = '5e8cdd3b8296523464c7462c';
    expect(await compatibilityService.getInterpeciesCompatibility([speciesA, speciesB]))
      .toMatchObject({
        "5e8cdd3b8296523464c7462a": {
          "5e8cdd3b8296523464c7462c": {
            "compatibility": 1, "warnings": expect.anything()
          }
        },
        "5e8cdd3b8296523464c7462c": {
          "5e8cdd3b8296523464c7462a": {
            "compatibility": 1, "warnings": expect.anything()
          }
        }
      });
  });

  test("Good compatibility", async() => {
    speciesA = '5e8cdd3b8296523464c7462b';
    speciesB = '5e8cdd3b8296523464c7462c';
    expect(await compatibilityService.getInterpeciesCompatibility([speciesA, speciesB]))
      .toMatchObject({
        "5e8cdd3b8296523464c7462b": {
          "5e8cdd3b8296523464c7462c": {
            "compatibility": 2, "warnings": expect.anything()
          }
        },
        "5e8cdd3b8296523464c7462c": {
          "5e8cdd3b8296523464c7462b": {
            "compatibility": 2, "warnings": expect.anything()
          }
        }
      });
  });

});

