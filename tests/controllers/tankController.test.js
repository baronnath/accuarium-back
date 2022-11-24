// test/controllers/tankController.test.js

const mongoose = require('mongoose');
const mongooseConfig = require(__dirname + '/../../config/mongoose');
const userController = require(__dirname + '/../../controllers/userController');
const userService = require(__dirname + '/../../services/userService');
const tankController = require(__dirname + '/../../controllers/tankController');
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
let adminTankId = '621021ce6599f2ed825133a4';
let userTankId = '621021ce6599f2ed825133a6';


beforeAll(async () => {
  await mongoose.connect(config['connectionString'], mongooseConfig);

  accessControl.init();

  admin = await User.findOne({ email: 'admin@accuarium.io' });
  user = await User.findOne({ email: 'user1@accuarium.io' });

});

// Close the connection
afterAll(async () => {
  await mongoose.connection.close();
});

// Create
describe('create', () => {
  const name = 'Tank test';
  const email = 'tanktest@accuarium.app';
  const locale = 'en';

  test('Valid tank created with min parameters', async () => {
    const req = await mockRequest(
      {},
      {
        name: name,
      }
    );
    const res = mockResponse();
    const next = mockNext();
    await tankController.create(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        'message': 'tank.create.success',
        'tank': expect.objectContaining({
          '__v': expect.anything(),
          '_id': expect.anything(),
          'name': name,
          'liters': null,
          'measures': expect.anything(),
          'species': expect.arrayContaining([]),
          'createdAt': expect.any(Date),
          'updatedAt': expect.any(Date),
        })
      })
    );
  });
  test('No name provided', async () => {
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
      await tankController.create(req, res, next);
    } catch (err) {
      expect(next).toBeDefined();
      expect(next.name).toBe('Error');
    }
  });
  test('Valid tank created with all parameters', async () => {
    const req = await mockRequest(
      {},
      {
        name: name,
      }
    );
    const res = mockResponse();
    const next = mockNext();
    await tankController.create(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        'message': 'tank.create.success',
        'tank': expect.objectContaining({
          '__v': expect.anything(),
          '_id': expect.anything(),
          'name': name,
          'liters': null,
          'measures': expect.anything(),
          'species': expect.arrayContaining([]),
          'createdAt': expect.any(Date),
          'updatedAt': expect.any(Date),
        })
      })
    );
  });
});

// Read
describe('Read', () => {

  test('Get tank by id', async () => {
    const req = await mockRequest(
      {},
      {
        tankId: adminTankId
      }
    );
    const res = mockResponse();
    const next = mockNext();
    await tankController.get(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        'tanks': expect.objectContaining({
            '__v': expect.anything(),
            '_id': expect.anything(),
            'name': 'Admin tank',
            'liters': 200,
            'measures': expect.anything(),
            'species': expect.anything(),
            'user': expect.anything(),
        })
      })
    );
  });

  test('Get tanks by user id', async () => {
    const req = await mockRequest(
      {},
      {
        userId: user._id,
      }
    );
    const res = mockResponse();
    const next = mockNext();
    await tankController.get(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        'tanks': expect.arrayContaining([
          expect.objectContaining({
            '__v': expect.anything(),
            '_id': expect.anything(),
            'name': 'User tank 1',
            'liters': 150,
            'measures': expect.anything(),
            'species': expect.anything(),
            'user': expect.anything(),
          }),
          expect.objectContaining({
            '__v': expect.anything(),
            '_id': expect.anything(),
            'name': 'User tank 2',
            'liters': 300,
            'measures': expect.anything(),
            'species': expect.anything(),
            'user': expect.anything(),
          }),
        ])
      })
    );
  });

  test('Get all tanks when no ids are provided', async () => {
    const req = mockRequest(
      {},
      {}
    );
    const res = mockResponse();
    const next = mockNext();
    await tankController.get(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        'tanks': expect.anything()
      })
    );
  });

  test('Get all tanks', async () => {
    const req = mockRequest(
      {},
      {}
    );
    const res = mockResponse();
    const next = mockNext();
    await tankController.getAll(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        'tanks': expect.anything()
      })
    );
  });

  test('Tank does not exist', async () => {
    const req = mockRequest({}, {
      tankId: 'nonExistingTank'
    });
    const res = mockResponse();

    try{
      await tankController.get(req, res);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe('TypeError');
    }
  });

  test('User does not exist', async () => {
    const req = mockRequest({}, {
      userId: 'nonExistingUser'
    });
    const res = mockResponse();
    const next = mockNext();
    try{
      await tankController.get(req, res);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe('TypeError');
    }
  });
});

// Update
describe('update', () => {

  test('Update tank', async () => {
    const req = await mockRequest(
      {},
      {
        tankId: adminTankId,
        liters: 450,
        height: 60
      },
      admin
    );
    const res = mockResponse();
    const next = mockNext();

    await tankController.update(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        'message': 'tank.update.success',
        'tanks': expect.objectContaining({
          '__v': expect.anything(),
          '_id': expect.anything(),
          'name': 'Admin tank',
          'measures': expect.objectContaining({'height': 60}),
          'liters': 450
        })
      })
    );
  });

  test('Tank does not exist', async () => {
    const req = await mockRequest(
      {},
      {
        tankId: 'nonExistingTank',
      }
    );
    const res = mockResponse();
    const next = mockNext();
    try{
      await tankController.update(req, res);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe('TypeError');
    }
  });

  test('User does not exist', async () => {
    const req = mockRequest({}, {
      userId: 'nonExistingUser'
    });
    const res = mockResponse();
    const next = mockNext();
    try{
      await tankController.update(req, res);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe('TypeError');
    }
  });

  test('No tank id provided', async () => {
    const req = await mockRequest({}, {});
    const res = mockResponse();
    const next = mockNext();
    try{
      await tankController.get(req, res);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe('TypeError');
    }
  });
});

// Add species
describe('addSpecies', () => {
  test('Species is added', async () => {
    const req = await mockRequest({}, {
      tankId: adminTankId,
      species: [{
        species: '5e8cdd3b8296523464c7462c',
        quantity: 30,
        main: false,
      }]
    });
    const res = mockResponse();
    const next = mockNext();

    await tankController.addSpecies(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        'message': 'tank.addSpecies.success',
        'tank': expect.objectContaining({
          '__v': expect.anything(),
          '_id': expect.anything(),
          'name': 'Admin tank',
          'species': expect.arrayContaining([
            expect.objectContaining({
              'species': expect.objectContaining({
                '_id':  mongoose.Types.ObjectId('5e8cdd3b8296523464c7462c')
              })
            })
          ])
        })
      })
    );
  });

  test('Several pecies are added', async () => {
    const req = await mockRequest({}, {
      tankId: userTankId,
      species: [{
        species: '5e8cdd3b8296523464c7462c',
        quantity: 30,
        main: false,
      },
      {
        species: '5e8cdd3b8296523464c7462b',
        quantity: 30,
        main: false,
      }]
    });
    const res = mockResponse();
    const next = mockNext();

    await tankController.addSpecies(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        'message': 'tank.addSpecies.success',
        'tank': expect.objectContaining({
          '__v': expect.anything(),
          '_id': expect.anything(),
          'name': 'User tank 2',
          'species': expect.arrayContaining([
            expect.objectContaining({
              'species': expect.objectContaining({
                '_id':  mongoose.Types.ObjectId('5e8cdd3b8296523464c7462b')
              })
            }),
            expect.objectContaining({
              'species': expect.objectContaining({
                '_id':  mongoose.Types.ObjectId('5e8cdd3b8296523464c7462c')
              })
            })
          ])
        })
      })
    );
  });

  test('Tank does not exist', async () => {
    const req = await mockRequest(
      {},
      {
        tankId: 'nonExistingTank',
      }
    );
    const res = mockResponse();
    const next = mockNext();

    try{
      await tankController.addSpecies(req, res, next);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe('TypeError');
    }
  });

  test('Species already added to tank previously', async () => {
    const req = await mockRequest({}, {
      tankId: userTankId,
      species: [{
        species: '5e8cdd3b8296523464c7462b',
        quantity: 30,
        main: false,
      }]
    });
    const res = mockResponse();
    const next = mockNext();

    try{
      await tankController.addSpecies(req, res, next);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe('TypeError');
    }
  });
});

// Delete
describe('delete', () => {
  test('Reject when no id is provided', async () => {
    const req = await mockRequest({}, {});
    const res = mockResponse();

    try{
      await tankController.delete(req, res);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe('TypeError');
    }
  });

  test('Tank does not exist', async () => {
    const req = await mockRequest(
      {},
      {
        tankId: 'nonExistingTank',
      }
    );
    const res = mockResponse();

    try{
      await tankController.delete(req, res);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe('TypeError');
    }
  });

  test('User does not exist', async () => {
    const req = mockRequest({}, {
      userId: 'nonExistingUser'
    });
    const res = mockResponse();
    const next = mockNext();
    try{
      await tankController.delete(req, res);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe('TypeError');
    }
  });

  test('Delete by tankId', async () => {
    const req = await mockRequest(
      {},
      {
        tankId: adminTankId
      },
    );
    const res = mockResponse();
    const next = mockNext();

    await tankController.delete(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('Delete all userId tanks', async () => {
    const req = await mockRequest(
      {},
      {
        userId: user._id
      },
    );
    const res = mockResponse();
    const next = mockNext();

    await tankController.delete(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

// Search
// TO BE FIXED
describe('search', () => {
  test('TO BE FIXED', async () => {
    expect(true).toBe(true);
  });
});
