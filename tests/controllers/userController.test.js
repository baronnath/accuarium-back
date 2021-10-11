// test/controllers/userController.test.js

const mongoose = require("mongoose");
const mongooseConfig = require(__dirname + "/../../config/mongoose");
const userController = require(__dirname + "/../../controllers/userController");
const userService = require(__dirname + "/../../services/userService");
const User = require(__dirname + "/../../models/user");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../../config/server")[env];
const { mockRequest, mockResponse, mockNext } = require(__dirname +
  "/../mocks.js");
const accessControl = require(__dirname + "/../../helpers/accessControl");
// const { ErrorHandler } = require(__dirname + "/../../helpers/error");

let connection;
let admin;
let player;
let validAccessToken;
let expiredAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVlOGNkZDNiODI5NjUyMzQ2NGM3NDYxZSIsImVtYWlsIjoibmF0YW4ubW9yb3RlQGdtYWlsLmNvbSIsIm5hbWUiOiJOYXRhbiIsInJvbGUiOnsiaWQiOiI1ZThjZGQzYjgyOTY1MjM0NjRjNzQ2MGUiLCJuYW1lIjoiYWRtaW4ifX0sImlhdCI6MTU4NjgxNjEyNiwiZXhwIjoxNTg3NDIwOTI2fQ.QqHDlmBRIBnO3Xd7wGQLf-3r9tMqxga3Ik2YKpaZyl4";
let invalidAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1Nzk3OTY0NTYsImV4cCI6MTU3OTg4Mjg1Nn0.6EDOt1JR985EMK-AM3rDdqLfxEYVc84y6iS00sQCc3Q";

beforeAll(async () => {
  mongoose.connect(config["connectionString"], mongooseConfig);

  accessControl.init();

  admin = await User.findOne({ email: "admin@diology.io" });
  player = await User.findOne({ email: "player1@diology.io" });

  validAccessToken = await userService.createAccessToken(admin);
});

// Close the connection
afterAll(async () => {
  mongoose.connection.close();
});

// Login
describe("isLoggedIn", () => {
  test("Response is correct with a valid token", async () => {
    const req = await mockRequest(
      {},
      {
        accessToken: validAccessToken,
      }
    );
    const res = mockResponse();
    const next = mockNext();
    await userController.isLoggedIn(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req).toHaveProperty("user");
  });
  test("Expired token is rejected", async () => {
    const req = mockRequest(
      {},
      {
        accessToken: expiredAccessToken,
      }
    );
    const res = mockResponse();
    await userController.isLoggedIn(req, res, (err) => {
      expect(err).toBeDefined();
      expect(err.name).toBe("TypeError");
    });
  });
  test("Not matching or invalid token is rejected", async () => {
    const req = await mockRequest(
      {},
      {
        accessToken: invalidAccessToken,
      }
    );
    const res = mockResponse();
    await userController.isLoggedIn(req, res, (err) => {
      expect(err).toBeTruthy();
      expect(err.name).toBe("TypeError");
    });
  });
});

// Grants and permissions
describe("isAllowedTo", () => {
  test('Grant access if user role is allowed to', async () => {
    const req = await mockRequest();
    req.user = admin;
    const res = mockResponse();
    const next = mockNext();
    const isAllowToTester = userController.isAllowedTo('createAny', 'user');
    let access = ac.can(req.user.role.name.en)['createAny']('user');
    await isAllowToTester(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  test('Deny access if user is not allowed to', async () => {
    const req = await mockRequest();
    req.user = player;
    const res = mockResponse();
    const next = mockNext();
    const isAllowToTester = userController.isAllowedTo('createAny', 'user');
    try{
      await isAllowToTester(req, res, next);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe("Error");
    }
  });
});

// Create
describe("create", () => {
  test("Response is correct when user is created", async () => {
    const req = await mockRequest(
      {},
      {
        email: "test@accuarium.io",
        password: "1234",
        role: "user",
        name: "Test",
      }
    );
    const res = mockResponse();
    const next = mockNext();

    await userController.create(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        "confirmationToken": expect.anything(),
        "message": expect.anything(),
        "user": expect.objectContaining({
            "__v": expect.anything(),
            "_id": expect.anything(),
            "createdAt": expect.any(Date),
            "email": "test@accuarium.io",
            "image": expect.anything(),
            "locale": expect.anything(),
            "name": "Test",
            "notification": true,
            "role": expect.any(Object),
            "synchronizedAt": expect.any(Date),
            "updatedAt": expect.any(Date),
        })
      })
    );
  });

  test('Duplicated email user creation is not allowed', async () => {
    const req = await mockRequest(
      {},
      {
        email: "test@accuarium.io",
        password: "1234",
        role: "user",
        name: "Test",
      }
    );
    const res = mockResponse();
    const next = mockNext();

    try{
      await userController.create(req, res, next);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe("ReferenceError");
    }
  });
});

// Read
describe('get', () => {
  test('Show user when user id is provided', async () => {
    const req = await mockRequest(
      {},
      {
        userId: '5e8cdd3b8296523464c7461d'
      }
    );
    const res = mockResponse();
    await userController.get(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        "user": expect.objectContaining({
            "__v": expect.anything(),
            "_id": expect.anything(),
            "createdAt": expect.any(Date),
            "email": "player1@diology.io",
            "image": expect.anything(),
            "name": "Player 1",
            "notification": true,
            "locale": expect.anything(),
            "role": expect.any(Object),
            "synchronizedAt": expect.any(Date),
            "updatedAt": expect.any(Date),
        })
      })
    );
  });

  test('Show user when user email is provided', async () => {
    const req = await mockRequest(
      {},
      {
        email: 'player1@diology.io'
      }
    );
    const res = mockResponse();
    await userController.get(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
            "user": expect.objectContaining({
              "__v": expect.anything(),
              "_id": expect.anything(),
              "createdAt": expect.any(Date),
              "email": "player1@diology.io",
              "image": expect.anything(),
              "name": "Player 1",
              "notification": true,
              "locale": expect.anything(),
              "role": expect.any(Object),
              "synchronizedAt": expect.any(Date),
              "updatedAt": expect.any(Date),
            })
        })
    );
  });

  test('Reject when user does not exist', async () => {
    const req = mockRequest(
      {},
      {
        userId: 99999
      }
    );
    const res = mockResponse();

    try{
      await userController.get(req, res);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe("TypeError");
    }
  });

  test('Reject when nor user email or id is provided', async () => {
    const req = mockRequest({}, {});
    const res = mockResponse();

    try{
      await userController.get(req, res);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe("TypeError");
    }
  });
});

// UpdateT
describe('update', () => {
  test('Update user when user id is provided', async () => {
    const req = await mockRequest(
      {},
      {
        userId: '5e8cdd3b8296523464c7461d',
        name: 'Player updated',
      },
      admin
    );
    const res = mockResponse();
    const next = mockNext();

    await userController.update(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        "data": expect.objectContaining({
          "user": expect.objectContaining({
            "__v": expect.anything(),
            "_id": expect.anything(),
            "createdAt": expect.any(Date),
            "email": "player1@diology.io",
            "image": expect.anything(),
            "name": "Player updated",
            "notification": true,
            "role": expect.any(Object),
            "updatedAt": expect.any(Date),
          })
        })
      })
    );
  });

  test('Update user when user email is provided', async () => {
    const req = await mockRequest(
      {},
      {
        email: 'player1@diology.io',
        name: 'Player updated twice'
      },
      admin
    );
    const res = mockResponse();
    const next = mockNext();

    await userController.update(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
          "user": expect.objectContaining({
            "__v": expect.anything(),
            "_id": expect.anything(),
            "createdAt": expect.any(Date),
            "email": "player1@diology.io",
            "image": expect.anything(),
            "name": "Player updated twice",
            "notification": true,
            "role": expect.any(Object),
            "updatedAt": expect.any(Date),
          })
      })
    );
  });

  test('Reject when user does not exist', async () => {
    const req = await mockRequest(
      {},
      {
        email: 'none@diology.io',
        name: 'None'
      }
    );
    const res = mockResponse();

    try{
      await userController.get(req, res);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe("TypeError");
    }
  });

  test('Reject when nor user email or id is provided', async () => {
    const req = await mockRequest({}, {});
    const res = mockResponse();

    try{
      await userController.get(req, res);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe("TypeError");
    }
  });
});

// Delete
describe('delete', () => {
  test('Reject when nor user email or id is provided', async () => {
    const req = await mockRequest({}, {}, admin);
    const res = mockResponse();

    try{
      await userController.delete(req, res);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe("TypeError");
    }
  });

  test('Reject when no permissions', async () => {
    const req = await mockRequest(
      {},
      {
        email: 'admin@diology.io'
      },
      player
     );
    const res = mockResponse();

    try{
      await userController.delete(req, res);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe("TypeError");
    }
  });

  test('Delete user when user id is provided', async () => {
    const req = await mockRequest(
      {},
      {
        userId: '5e8cdd3b8296523464c7461d'
      },
      admin
    );
    const res = mockResponse();
    const next = mockNext();

    console.log(req.body);

    await userController.delete(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('Delete user when user email is provided', async () => {
    const req = await mockRequest(
      {},
      {
        email: 'player2@diology.io'
      },
      admin
    );
    const res = mockResponse();
    const next = mockNext();

    await userController.delete(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
  
// Login
describe('login', () => {
  test('Valid credentials return user and access token', async () => {
    const req = await mockRequest(
      {},
      {
        email: 'admin@diology.io',
        password: 'diology'
      }
    );
    const res = mockResponse();
    const next = mockNext();

    await userController.login(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        'accessToken': expect.anything(),
        "data": expect.objectContaining({
          "user": expect.objectContaining({
            "__v": expect.anything(),
            "_id": expect.anything(),
            "createdAt": expect.any(Date),
            "email": "admin@diology.io",
            "image": expect.anything(),
            "name": "Admin",
            "notification": true,
            "role": expect.objectContaining({
              "__v": expect.anything(),
              "_id": expect.anything(),
              "name": "admin",
            }),
            "updatedAt": expect.any(Date),
          })
        }),
        'message': expect.anything()
      })
    );
  });

  test('Reject login with invalid password', async () => {
    const req = await mockRequest(
      {},
      {
        email: 'admin@diology.io',
        password: 'wrong'
      }
    );
    const res = mockResponse();

    try{
      await userController.login(req, res);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe("TypeError");
    }
  });

  test('Reject login with invalid email', async () => {
    const req = await mockRequest(
      {},
      {
        email: 'none@diology.io',
        password: 'diology'
      }
    );
    const res = mockResponse();

    try{
      await userController.login(req, res);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe("TypeError");
    }
  });

  test('Reject not verified user', async () => {
    const req = mockRequest(
      {},
      {
        email: 'notverified@diology.io',
        password: 'diology'
      }
    );
    const res = mockResponse();
    const next = mockNext();

    try{
      await userController.login(req, res, next);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe("TypeError");
    }
  });

  test('Reject login if credentials are not provided', async () => {
    let req = mockRequest(
      {},
      {
        email: 'player1@diology.io',
      }
    );
    const res = mockResponse();

    try{
      await userController.login(req, res, next);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe("ReferenceError");
    }
  });
});

// Verify
describe('verify', () => {
  test('Reject when confirmation code or email is not valid', async () => {
    let req = await mockRequest(
      {},
      {
        email: 'notverified@diology.io',
        password: 'diology',
        confirmationToken: 'abcdefghijklmnopqrstuvwyz'
      }
    );
    let res = mockResponse();
    const next = mockNext();

    try{
      await userController.verify(req, res, next);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe("ReferenceError");
    }
    
    req = await mockRequest(
      {},
      {
        email: 'none@diology.io',
        password: 'diology',
        confirmationToken: '07c72b3d45fa5b42ee2fe8fea6b7a83cb64e86e61074a0d2ee97e13653da'
      }
    );
    res = mockResponse();

    try{
      await userController.verify(req, res, next);
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err.name).toBe("ReferenceError");
    }
  });

  test('Confirmation is completed with valid code', async () => {

    const req = await mockRequest(
      {},
      {
        email: 'notverified@diology.io',
        confirmationToken: 'abcdefghijklmn'
      }
    );
    const res = mockResponse();
    const next = mockNext();

    await userController.verify(req, res, next);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        "data": expect.objectContaining({
          "user": expect.objectContaining({
            "__v": expect.anything(),
            "_id": expect.anything(),
            "createdAt": expect.any(Date),
            "email": "notverified@diology.io",
            "image": expect.anything(),
            "name": "Not verified",
            "notification": true,
            "role": expect.objectContaining({
              "__v": expect.anything(),
              "_id": expect.anything(),
              "name": "player",
            }),
            "updatedAt": expect.any(Date),
          })
        }),
        "message": "user.verify.success",
      })
    );
  });
});