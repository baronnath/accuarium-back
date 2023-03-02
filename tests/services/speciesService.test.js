// test/services/speciesService.test.js

const mongoose = require("mongoose");
const mongooseConfig = require(__dirname + "/../../config/mongoose");
const dotenv  = require('dotenv');
const { update } = require("../../models/species");
const speciesService = require(__dirname + "/../../services/speciesService");
const User = require(__dirname + '/../../models/user');
const Tank = require(__dirname + '/../../models/tank');
const Species = require(__dirname + '/../../models/species');
const Role = require(__dirname + '/../../models/role');
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../../config/server")[env];
const { mockRequest, mockResponse, mockNext } = require(__dirname + "/../mocks.js");

beforeAll(async () => {
  dotenv.config();

  await mongoose.connect(process.env["database_connection_string_" + env], mongooseConfig);

  tank = await Tank.findById('621021ce6599f2ed825133a5');
  noMainSpeciesTank = await Tank.findById('621021ce6599f2ed825133a7');
  noSpeciesTank = await Tank.findById('621021ce6599f2ed825133a8');
});

// Close the connection
afterAll(async () => {
  await mongoose.connection.close();
});

// Find main species in tank
describe("findMainSpecies", () => {
  test("Main species is found", async () => {
    let res = await speciesService.findMainSpecies(tank.species);

    expect(res.main).toEqual(true);
    expect(res.quantity).toEqual(expect.any(Number));
    expect(res.species).toEqual(expect.any(Species));
  });

  test("No main species in tank", async () => {
    let res = await speciesService.findMainSpecies(noMainSpeciesTank.species);

    expect(res).toEqual(null);
  });

  test("Tank with no species", async () => {
    expect(() => speciesService.findMainSpecies(noSpeciesTank.species)).toThrowError("tank.noSpecies");;
  });
});
