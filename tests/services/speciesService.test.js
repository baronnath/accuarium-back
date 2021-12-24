// test/services/speciesService.test.js

const mongoose = require("mongoose");
const { update } = require("../../models/species");
const mongooseConfig = require(__dirname + "/../../config/mongoose");
const speciesService = require(__dirname + "/../../services/speciesService");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../../config/server")[env];
const { mockRequest, mockResponse, mockNext } = require(__dirname +
  "/../mocks.js");

beforeAll(async () => {
  await mongoose.connect(config["connectionString"], mongooseConfig);
});

// Close the connection
afterAll(async () => {
  await mongoose.connection.close();
});

// Login
describe("uploadFile", () => {
  test("File is uploaded", async () => {
    let req = await mockRequest();
    req.file = { 
        path : __dirname + "/../../private/uploads/uploadFileTest.xlsx"
    };
    const res = mockResponse();
    const next = mockNext();
    let update = await speciesService.uploadFile(req, res, next);
    // console.log(update);
    expect(update).toHaveProperty('nMatched',6);
    expect(update).toHaveProperty('nModified',6);
    expect(update).toHaveProperty('ok',1);
  });

});

