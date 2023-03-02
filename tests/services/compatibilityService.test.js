// test/services/compatibilityService.test.js

const mongoose = require("mongoose");
const mongooseConfig = require(__dirname + '/../../config/mongoose');
const dotenv  = require('dotenv');
const { update } = require("../../models/species");
const { functionsToTest: compatibilityService } = require(__dirname + "/../../services/compatibilityService");
const User = require(__dirname + '/../../models/user');
const Tank = require(__dirname + '/../../models/tank');
const Role = require(__dirname + '/../../models/role');
const Group = require(__dirname + '/../../models/group');
const Color = require(__dirname + '/../../models/color');
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../../config/server")[env];
const { mockRequest, mockResponse, mockNext } = require(__dirname + "/../mocks.js");

beforeAll(async () => {
  dotenv.config();

  await mongoose.connect(process.env["database_connection_string_" + env], mongooseConfig);

  tank = await Tank.findById('621021ce6599f2ed825133a5');
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

  // describe("isCoexistenceCompatible", () => {
  //   test("Compatible coexistence", () => {
  //     console.log(tank);
  //     let res = compatibilityService.isCoexistenceCompatible(tank.species);
  //     expect(res).toBe(true);
  //   });
  // });

});

