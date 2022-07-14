// routes/leadRoute.js

const leadController  = require('../controllers').lead;
const { validate } = require('../validator/validator');
const leadValidator = require('../validator/validators/leadValidator');

module.exports = function(app){
    
    // CREATE USER
    /**
     * @api {post} /lead/create Create
     * @apiName Create
     * @apiDescription Create lead.
     * @apiGroup User
     * @apiPermission admin
     * @apiVersion 0.1.0
     *
     * @apiParam {Number} leadId                    The lead unique id to be retrieved.  Not required if lead email is provided.
     * @apiParam {String} [email]                   The lead email to be retrieved. Not required if leadId is provided. 
     * @apiParam {String{300..400}} accessToken     The authentication access token of current logged in lead.
     *
     * @apiExample {js} Example usage:
     *      {
     *          "email": "abc@abc.abc",
     *          "locale": "es",
     *      }
     *
     * @apiSuccess (Success 201 Created) {Object} data Data container.
     * @apiSuccess (Success 201 Created) {Object} data.lead The logged in lead information.
     * @apiSuccess (Success 201 Created) {Number} data.lead.id The lead unique id.
     * @apiSuccess (Success 201 Created) {String} data.lead.email The lead unique email.
     * @apiSuccess (Success 201 Created) {Number} data.lead.locale The lead language preferences.
     * @apiSuccess (Success 201 Created) {String} message Lead creation success message.
     *
     * @apiSuccessExample {json} Success response:
     *      HTTPS 201 Created
     *      {
     *          "data": {
     *             "lead": {
     *                  "id": 2,
     *                  "email": "ghi@ghi.ghi",
     *                  "locale": "en"
     *              }
     *          },
     *          "message": "Lead has been created successfully"
     *      }
     */
    app.post('/lead',
        // leadController.isLoggedIn,
        // leadController.isAllowedTo('createAny', 'lead'),
        leadValidator.createRules(),
        validate,
        leadController.create
    );

    app.get('/lead',
        leadValidator.getRules(),
        validate,
        leadController.get
    );

    app.get('/leads',
        // depthValidator.getRules(),
        // validate,
        leadController.getAll
    );

    app.put('/lead',
        leadValidator.updateRules(),
        validate,
        leadController.update
    );

    app.delete('/lead',
        leadValidator.deleteRules(),
        validate,
        leadController.delete
    );
}

