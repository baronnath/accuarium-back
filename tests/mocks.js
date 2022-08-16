// tests/mocks.js

const i18next       = require("i18next");
// const Backend       = require("i18next-node-fs-backend");
const translatorConfig  = require(__dirname + "/../config/translator");

// Create a fake request
exports.mockRequest = async (headers, body, user, sessionData = {}) => ({
  headers,
  session: { data: sessionData },
  body,
  i18n: {
  	t: await i18nInit()
  },
  user: user,
});

// Create a fake response
exports.mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

exports.mockNext = () => {
  const next = jest.fn();
  return next;
};

async function i18nInit() {
	i18n = await i18next.init(translatorConfig['init']);
	return i18n;
}