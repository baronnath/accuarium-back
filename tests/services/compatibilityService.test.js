// test/services/compatibilityService.test.js

const mongoose = require("mongoose");
const { update } = require("../../models/species");
const mongooseConfig = require(__dirname + "/../../config/mongoose");
const { forTesting } = require(__dirname + "/../../services/compatibilityService");
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

describe("parameters compatibility", () => {
  test("Compatible parameters", () => {
    rangeA = {
      min: 0,
      max: 15
    };
    rangeB = {
      min: 3,
      max: 18
    };

    let res = forTesting.isParameterCompatible(rangeA, rangeB);
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

    let res = forTesting.isParameterCompatible(rangeA, rangeB);
    expect(res).toBe(false);
  });

  test("Not defined parameters", () => {
    rangeA, rangeB = {};

    let res = forTesting.isParameterCompatible(rangeA, rangeB);
    expect(res).toBe(null);
  });

  test("Range parameters are zero", () => {
    rangeA, rangeB = {
      min: 0,
      max: 0
    };

    let res = forTesting.isParameterCompatible(rangeA, rangeB);
    expect(res).toBe(null);
  });

  test("Min. range is zero", () => {
    rangeA, rangeB = {
      min: 0,
      max: 15
    };

    let res = forTesting.isParameterCompatible(rangeA, rangeB);
    expect(res).toBe(true);
  });

});

