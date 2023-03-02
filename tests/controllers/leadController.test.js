// test/controllers/leadController.test.js

const mongoose = require('mongoose');
const mongooseConfig = require(__dirname + '/../../config/mongoose');
const dotenv  = require('dotenv');
const userController = require(__dirname + '/../../controllers/userController');
const userService = require(__dirname + '/../../services/userService');
const leadController = require(__dirname + '/../../controllers/leadController');
const User = require(__dirname + '/../../models/user');
const Lead = require(__dirname + '/../../models/lead');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/server')[env];
const { mockRequest, mockResponse, mockNext } = require(__dirname +
  '/../mocks.js');
const accessControl = require(__dirname + '/../../helpers/accessControl');
// const { ErrorHandler } = require(__dirname + '/../../helpers/error');

let admin;
let user;
let lead;
let email = 'lead@accuarium.app';
let locale = 'en';

beforeAll(async () => {
  dotenv.config();

  await mongoose.connect(process.env["database_connection_string_" + env], mongooseConfig);

  await accessControl.init();

  admin = await User.findOne({ email: 'admin@accuarium.io' });
  user = await User.findOne({ email: 'user1@accuarium.io' });
  lead = await Lead.findOne({ email: 'lead1@accuarium.app' });
});

// Close the connection
afterAll(async () => {
  await mongoose.connection.close();
});

// Create
describe('create', () => {

  test('Valid lead created', async () => {
    const req = await mockRequest(
      {},
      {
        email: email,
		    locale: locale,
      }
    );
    const res = mockResponse();
    const next = mockNext();
    await leadController.create(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        'lead': expect.objectContaining({
            '__v': expect.anything(),
            '_id': expect.anything(),
            'createdAt': expect.any(Date),
            'email': email,
            'locale': locale,
            'synchronizedAt': expect.any(Date),
            'updatedAt': expect.any(Date),
        })
      })
    );
  });
  test('Already registered', async () => {
    const req = await mockRequest(
      {
        email: email,
		    locale: locale,
      },
      {}
    );
    const res = mockResponse();
    const next = mockNext();
    try{
      await leadController.create(req, res, next);
    } catch (err) {
      expect(next).toBeDefined();
      expect(next.name).toBe('Error');
    }
    
  });
  test('No email provided', async () => {
    const req = await mockRequest(
      {},
      {
        email: email,
		    locale: locale,
      }
    );
    const res = mockResponse();
    const next = mockNext();
    try{
      await leadController.create(req, res, next);
    } catch (err) {
      expect(next).toBeDefined();
      expect(next.name).toBe('Error');
    }
  });
  test('Empty email provided', async () => {
    const req = await mockRequest(
      {},
      {
        email: '',
		    locale: locale,
      }
    );
    const res = mockResponse();
    const next = mockNext();
    try{
      await leadController.create(req, res, next);
    } catch (err) {
      expect(next).toBeDefined();
      expect(next.name).toBe('Error');
    }
  });
  test('No locale provided', async () => {
    const req = await mockRequest(
      {},
      {
        email: email,
      }
    );
    const res = mockResponse();
    const next = mockNext();
    try{
      await leadController.create(req, res, next);
    } catch (err) {
      expect(next).toBeDefined();
      expect(next.name).toBe('Error');
    }
  });
  test('Anyone can create', async () => {
    const req = await mockRequest();
    req.user = user;
    const res = mockResponse();
    const next = mockNext();
    const isAllowToTester = userController.isAllowedTo('createAny', 'lead');
    let access = ac.can(req.user.role.name.en)['createAny']('user');
    await isAllowToTester(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});

// Read
describe('Read', () => {

  test('Get lead by id', async () => {
    const req = await mockRequest(
      {},
      {
        leadId: lead._id
      }
    );
    const res = mockResponse();
    await leadController.get(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        'lead': expect.objectContaining({
            '__v': expect.anything(),
            '_id': lead._id,
            'createdAt': expect.any(Date),
            'email': lead.email,
            'locale': expect.anything(),
            'synchronizedAt': expect.any(Date),
            'updatedAt': expect.any(Date),
        })
      })
    );
  });

  test('Get lead by email', async () => {
    const req = await mockRequest(
      {},
      {
        email: lead.email,
      }
    );
    const res = mockResponse();
    await leadController.get(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
            'lead': expect.objectContaining({
              '__v': expect.anything(),
              '_id': lead._id,
              'email': lead.email,
              'locale': expect.anything(),
              'synchronizedAt': expect.any(Date),
              'updatedAt': expect.any(Date),
            })
        })
    );
  });

  test('Non existing lead', async () => {
    const req = mockRequest(
      {},
      {
        leadId: 'abc123'
      }
    );
    const res = mockResponse();

    try{
      await leadController.get(req, res);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe('TypeError');
    }
  });

  test('No email nor id is provided', async () => {
    const req = mockRequest({}, {});
    const res = mockResponse();

    try{
      await leadController.get(req, res);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe('TypeError');
    }
  });

  test('Admin access granted', async () => {
    const req = await mockRequest();
    req.user = admin;
    const res = mockResponse();
    const next = mockNext();
    const isAllowToTester = userController.isAllowedTo('readAny', 'lead');
    let access = ac.can(req.user.role.name.en)['readAny']('lead');
    await isAllowToTester(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  test('User access denied', async () => {
    const req = await mockRequest();
    req.user = user;
    const res = mockResponse();
    const next = mockNext();
    const isAllowToTester = userController.isAllowedTo('readAny', 'lead');
    try{
      await isAllowToTester(req, res, next);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe('Error');
    }
  });
});

// Update
describe('update', () => {

  test('Update lead by id', async () => {
    const req = await mockRequest(
      {},
      {
        leadId: lead._id,
        locale: 'es',
      },
      {},
      admin
    );
    const res = mockResponse();
    const next = mockNext();

    await leadController.update(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        'message': expect.anything(),
        'lead': expect.objectContaining({
          '__v': expect.anything(),
          '_id': lead._id,
          'email': lead.email,
          'locale': 'es',
        })
      })
    );
  });

  test('Update lead by email', async () => {
    const req = await mockRequest(
      {},
      {
        email: lead.email,
        locale: 'en'
      },
      {},
      admin
    );
    const res = mockResponse();
    const next = mockNext();

    await leadController.update(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
          'lead': expect.objectContaining({
            '__v': expect.anything(),
            '_id': lead._id,
            'createdAt': expect.any(Date),
            'email': lead.email,
            'locale': 'en',
            'updatedAt': expect.any(Date),
          })
      })
    );
  });

  test('Lead does not exist', async () => {
    const req = await mockRequest(
      {},
      {
        email: 'none@accuarium.app',
      }
    );
    const res = mockResponse();

    try{
      await userController.get(req, res);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe('TypeError');
    }
  });

  test('No email nor id is provided', async () => {
    const req = await mockRequest({}, {});
    const res = mockResponse();

    try{
      await leadController.update(req, res);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe('TypeError');
    }
  });
});

// Delete
describe('delete', () => {
  test('Reject when nor user email or id is provided', async () => {
    const req = await mockRequest({}, {}, {}, admin);
    const res = mockResponse();

    try{
      await userController.delete(req, res);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe('TypeError');
    }
  });

  test('Delete by id', async () => {
    const req = await mockRequest(
      {},
      {
        leadId: lead._id
      },
      {},
      admin
    );
    const res = mockResponse();
    const next = mockNext();

    await leadController.delete(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('Delete by email', async () => {
    const req = await mockRequest(
      {},
      {
        email: email
      },
      {},
      admin
    );
    const res = mockResponse();
    const next = mockNext();

    await leadController.delete(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});