// test/controllers/unitConverter.test.js

const { mockRequest, mockResponse, mockNext } = require(__dirname + "/../mocks.js");
const unitConverter = require(__dirname + "/../../helpers/unitConverter");


// Login
describe("CONVERTER", () => {
    test("Response is correct with a valid token", async () => {
      value = await unitConverter('length', 'cm', 'ft', 1)
        .then(value => { return value })
        .catch(err => console.log(err));
      console.log('HUY', value);
      expect(value).toBe(21);
    });
  });
