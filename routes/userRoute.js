// routes/userRoute.js

const userController  = require('../controllers').user;
const { validate } = require('../validator/validator');
const userValidator = require('../validator/validators/userValidator');

module.exports = function(app){
    
    // VERIFY USER
    /**
     * @api {post} /user/verify Verify email
     * @apiName Verify
     * @apiDescription Verify the user email and create the password.
     * @apiGroup User
     * @apiPermission none
     * @apiVersion 0.1.0
     *
     * @apiParam {String} email                     The email must be already registered.
     * @apiParam {String} password                  Minimun 4 characters.
     * @apiParam {String{60}} confirmationToken     Confirmation code provided by email.
     *
     * @apiExample {js} Example usage:
     *      {
     *          "email": "abc@abc.abc",
     *          "password": "abcd",
     *          "confirmationToken": "0d46445ef9b45c4198dc2042c1a3965922d108f9167491829f09f0422182"
     *      }
     *
     * @apiSuccess (Success 201 Created) {Object} data Data container.
     * @apiSuccess (Success 201 Created) {Object} data.user The verified user information.
     * @apiSuccess (Success 201 Created) {Number} data.user.id The user unique id.
     * @apiSuccess (Success 201 Created) {String} data.user.email The user unique email.
     * @apiSuccess (Success 201 Created) {String} data.user.lastName The user name.
     * @apiSuccess (Success 201 Created) {String} data.user.firstName The user firstname.
     * @apiSuccess (Success 201 Created) {Datetime} data.user.createdAt The time the user was created.
     * @apiSuccess (Success 201 Created) {Datetime} data.user.updatedAt The time the user was last time updated.
     * @apiSuccess (Success 201 Created) {Number} data.user.roleId The user role id.
     * @apiSuccess (Success 201 Created) {String} message Welcome message.
     *
     * @apiSuccessExample {json} Success response:
     *     HTTPS 201 Created
     *     {
     *         "data": {
     *             "user": {
     *                 "id": 1,
     *                 "email": "abc@abc.abc",
     *                 "firstName": "Abc",
     *                 "lastName": "Def",
     *                 "createdAt": "2020-02-05T13:21:23.000Z",
     *                 "updatedAt": "2020-02-06T10:33:05.000Z",
     *                 "roleId": 1
     *             }
     *         },
     *         "message": "Welcome Abc, thank you for verifying your account"
     *     }
     */
    app.post('/user/verify',
        userValidator.verifyRules(),
        validate,
        userController.verify
    );

    app.get('/user/verify/resend',
        userValidator.resendRules(),
        validate,
        userController.resend
    );

    // LOGIN
    /**
     * @api {post} /user/login Login
     * @apiName Login
     * @apiDescription Login user by credentials.
     * @apiGroup User
     * @apiPermission none
     * @apiVersion 0.1.0
     *
     * @apiParam {String} email                     The user email registered.
     * @apiParam {String{min.4}} password           The password created previously by the user when verified.
     *
     * @apiExample {js} Example usage:
     *     {
     *         "email": "abc@abc.abc",
     *         "password": "abcd",
     *         "confirmationToken": "0d46445ef9b45c4198dc2042c1a3965922d108f9167491829f09f0422182"
     *     }
     *
     * @apiSuccess (Success 200 OK) {Object} data Data container.
     * @apiSuccess (Success 200 OK) {Object} data.user The logged in user information.
     * @apiSuccess (Success 200 OK) {Number} data.user.id The user unique id.
     * @apiSuccess (Success 200 OK) {String} data.user.email The user unique email.
     * @apiSuccess (Success 200 OK) {String} data.user.lastName The user name.
     * @apiSuccess (Success 200 OK) {String} data.user.firstName The user firstname.
     * @apiSuccess (Success 200 OK) {String} data.user.confirmationToken Null value.
     * @apiSuccess (Success 200 OK) {String} data.user.accessToken The user authentication access token.
     * @apiSuccess (Success 200 OK) {Datetime} data.user.createdAt The time the user was created.
     * @apiSuccess (Success 200 OK) {Datetime} data.user.updatedAt The time the user was last time updated.
     * @apiSuccess (Success 200 OK) {Number} data.user.roleId The role id.
     * @apiSuccess (Success 200 OK) {Object} data.user.role The logged in user's role information.
     * @apiSuccess (Success 200 OK) {Number} data.user.role.id The role unique id.
     * @apiSuccess (Success 200 OK) {String} data.user.role.name The role name.
     * @apiSuccess (Success 200 OK) {String} message Login success message.
     * @apiSuccess (Success 200 OK) {String} accessToken The user authentication access token.
     *
     * @apiSuccessExample {json} Success response:
     *      HTTPS 200 OK
     *      {
     *          "data": {
     *              "user": {
     *                  "id": 2,
     *                  "email": "abc@abc.abc",
     *                  "password": "$2b$10$3q7N0R2JiUan8i2fPZDgE.HUZ/zDWECk/MM7D..UpEPOx3IKS2Q2K",
     *                  "firstName": "Abc",
     *                  "lastName": "Def",
     *                  "confirmationToken": null,
     *                  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     *                  "createdAt": "2020-02-05T13:21:23.000Z",
     *                  "updatedAt": "2020-02-06T11:52:40.000Z",
     *                  "roleId": 2,
     *                  "role": {
     *                      "id": 2,
     *                      "name": "User"
     *                  }
     *              }
     *          },
     *          "message": "Hi DEF, you are now logged in",
     *          "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     *      }
     */
    app.post('/user/login',
        userValidator.loginRules(),
        validate,
        userController.login
    );

    // LOGOUT
    /**
     * @api {post} /user/logout Logout
     * @apiName Logout
     * @apiDescription Logout user destroying the access token.
     * @apiGroup User
     * @apiPermission logged in
     * @apiVersion 0.1.0
     *
     * @apiParam {String{300..400}} accessToken     The authentication access token of current logged in user.
     *
     * @apiExample {js} Example usage with user id:
     *      {
     *          "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     *      }
     *
     * @apiSuccess (Success 200 OK) {String} message The logout confirmation message.
     *
     * @apiSuccessExample {json} Success response:
     *      HTTPS 200 OK
     *      {
     *          "message": "See you soon, ABC"
     *      }
     */
    app.post('/user/logout',
        userController.isLoggedIn,
        userController.isAllowedTo('updateOwn', 'user'),
        userController.logout
    );

    // CREATE USER
    /**
     * @api {post} /user/create Create
     * @apiName Create
     * @apiDescription Create user.
     * @apiGroup User
     * @apiPermission admin
     * @apiVersion 0.1.0
     *
     * @apiParam {Number} userId                    The user unique id to be retrieved.  Not required if user email is provided.
     * @apiParam {String} [email]                   The user email to be retrieved. Not required if userId is provided. 
     * @apiParam {String{300..400}} accessToken     The authentication access token of current logged in user.
     *
     * @apiExample {js} Example usage:
     *      {
     *          "email": "abc@abc.abc",
     *          "lastName": "Abc",
     *          "firstName": "Def",
     *          "roleId": 2,
     *          "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     *      }
     *
     * @apiSuccess (Success 201 Created) {Object} data Data container.
     * @apiSuccess (Success 201 Created) {Object} data.user The logged in user information.
     * @apiSuccess (Success 201 Created) {Number} data.user.id The user unique id.
     * @apiSuccess (Success 201 Created) {String} data.user.email The user unique email.
     * @apiSuccess (Success 201 Created) {String} data.user.firstName The user firstname.
     * @apiSuccess (Success 201 Created) {String} data.user.lastName The user name.
     * @apiSuccess (Success 201 Created) {Datetime} data.user.createdAt The time the user was created.
     * @apiSuccess (Success 201 Created) {Datetime} data.user.updatedAt The time the user was last time updated.
     * @apiSuccess (Success 201 Created) {Number} data.user.roleId The role id.
     * @apiSuccess (Success 201 Created) {String} message User creation success message.
     *
     * @apiSuccessExample {json} Success response:
     *      HTTPS 201 Created
     *      {
     *          "data": {
     *             "user": {
     *                  "id": 2,
     *                  "email": "ghi@ghi.ghi",
     *                  "firstName": "Ghi",
     *                  "lastName": "Jkl",
     *                  "createdAt": "2020-02-06T12:53:27.000Z",
     *                  "updatedAt": "2020-02-06T12:53:27.000Z",
     *                  "roleId": 2
     *              }
     *          },
     *          "message": "Ghi's user has been created successfully"
     *      }
     */
    app.post('/user',
        // userController.isLoggedIn,
        // userController.isAllowedTo('createAny', 'user'),
        userValidator.createRules(),
        validate,
        userController.create
    );

    // READ USER
    /**
     * @api {get} /user/get Get
     * @apiName Get
     * @apiDescription Retrieve an user information.
     * @apiGroup User
     * @apiPermission logged in
     * @apiVersion 0.1.0
     *
     * @apiParam {Number} userId                    The user unique id to be retrieved.  Not required if user email is provided.
     * @apiParam {String} [email]                   The user email to be retrieved. Not required if userId is provided. 
     * @apiParam {String{300..400}} accessToken     The authentication access token of current logged in user.
     *
     * @apiExample {js} Example usage with user id:
     *      {
     *          "userId": "1",
     *          "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     *      }
     * @apiExample {js} Example usage with email:
     *      {
     *          "email": "abc@abc.abc",
     *          "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     *      }
     *
     * @apiSuccess (Success 200 OK) {Object} data Data container.
     * @apiSuccess (Success 200 OK) {Object} data.user The logged in user information.
     * @apiSuccess (Success 200 OK) {Number} data.user.id The user unique id.
     * @apiSuccess (Success 200 OK) {String} data.user.email The user unique email.
     * @apiSuccess (Success 200 OK) {String} data.user.firstName The user firstname.
     * @apiSuccess (Success 200 OK) {String} data.user.lastName The user name.
     * @apiSuccess (Success 200 OK) {Datetime} data.user.createdAt The time the user was created.
     * @apiSuccess (Success 200 OK) {Datetime} data.user.updatedAt The time the user was last time updated.
     * @apiSuccess (Success 200 OK) {Number} data.user.roleId The role id.
     *
     * @apiSuccessExample {json} Success response:
     *      HTTPS 200 OK
     *      {
     *          "data": {
     *              "user": {
     *                  "id": 1,
     *                  "email": "abc@abc.abc",
     *                  "firstName": "Abc",
     *                  "lastName": "Def",
     *                  "createdAt": "2020-02-05T13:21:23.000Z",
     *                  "updatedAt": "2020-02-06T13:49:52.000Z",
     *                  "roleId": 1
     *              }
     *          }
     *      }
     */
    app.get('/user',
        userController.isLoggedIn,
        userController.isAllowedTo('readAny', 'user'),
        userValidator.getRules(),
        validate,
        userController.get
    );

    // UPDATE USER
    /**
     * @api {put} /user Update
     * @apiName Update
     * @apiDescription Update the user information.
     * @apiGroup User
     * @apiPermission admin / own
     * @apiVersion 0.1.0
     *
     * @apiParam {Number} userId                    The user unique id to be retrieved.  Not required if user email is provided.
     * @apiParam {String} [email]                   The user email to be retrieved. Not required if userId is provided. 
     * @apiParam {String{300..400}} accessToken     The authentication access token of current logged in user.
     *
     * @apiExample {js} Example usage with user id:
     *      {
     *          "userId": "1",
     *          "firstName": "Ghi",
     *          "lastName": "Jkl",
     *          "roleId": 2
     *          "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     *      }
     * @apiExample {js} Example usage with email:
     *      {
     *          "email": "abc@abc.abc",
     *          "firstName": "Ghi",
     *          "lastName": "Jkl",
     *          "roleId": 2
     *          "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     *      }
     *
     * @apiSuccess (Success 201 Created) {Object} data Data container.
     * @apiSuccess (Success 201 Created) {Object} data.user The logged in user information.
     * @apiSuccess (Success 201 Created) {Number} data.user.id The user unique id.
     * @apiSuccess (Success 201 Created) {String} data.user.email The user unique email.
     * @apiSuccess (Success 201 Created) {String} data.user.firstName The user firstname.
     * @apiSuccess (Success 201 Created) {String} data.user.lastName The user name.
     * @apiSuccess (Success 201 Created) {Datetime} data.user.createdAt The time the user was created.
     * @apiSuccess (Success 201 Created) {Datetime} data.user.updatedAt The time the user was last time updated.
     * @apiSuccess (Success 201 Created) {Number} data.user.roleId The role id.
     * @apiSuccess (Success 201 Created) {String} message User update success message.
     *
     * @apiSuccessExample {json} Success response:
     *      HTTPS 201 Created
     *      {
     *          "data": {
     *              "user": {
     *                  "id": 1,
     *                  "email": "abc@abc.abc",
     *                  "firstName": "Ghi",
     *                  "lastName": "Jkl",
     *                  "createdAt": "2020-02-05T13:21:23.000Z",
     *                  "updatedAt": "2020-02-06T13:49:52.000Z",
     *                  "roleId": 2
     *              },
     *          },
     *          "message": "The user Ghi has been updated successfully"
     *      }
     */
    app.put('/user',
        userController.isLoggedIn,
        userController.isAllowedTo('updateOwn', 'user'),
        userValidator.updateRules(),
        validate,
        userController.update
    );

    // DELETE USER
    /**
     * @api {delete} /user Delete
     * @apiName Delete
     * @apiDescription Delete the user.
     * @apiGroup User
     * @apiPermission admin / own
     * @apiVersion 0.1.0
     *
     * @apiParam {Number} userId                    The user unique id to be retrieved.  Not required if user email is provided.
     * @apiParam {String} [email]                   The user email to be retrieved. Not required if userId is provided. 
     * @apiParam {String{300..400}} accessToken     The authentication access token of current logged in user.
     *
     * @apiExample {js} Example usage with user id:
     *      {
     *          "userId": "1",
     *          "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     *      }
     * @apiExample {js} Example usage with email:
     *      {
     *          "email": "abc@abc.abc",
     *          "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     *      }
     *
     * @apiSuccess (Success 201 Created) {String} message User delete success message.
     *
     * @apiSuccessExample {json} Success response:
     *      HTTPS 201 Created
     *      {
     *          "message": "The user Abc has been updated successfully"
     *      }
     */
    app.delete('/user',
        userController.isLoggedIn,
        userController.isAllowedTo('deleteOwn', 'user'),
        userValidator.deleteRules(),
        validate,
        userController.delete
    );

    app.get('/user/search',
        userController.isLoggedIn,
        userController.isAllowedTo('readAny', 'user'),
        userValidator.searchRules(),
        validate,
        userController.search
    );

}

