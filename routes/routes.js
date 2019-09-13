
const user = require('./user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = "jWTsecRet"

const appRoutes = (app, db) => {

    user.setDB(db)

    /**
    * @swagger
    * definitions:
    *   Register:
    *     required:
    *       - email
    *       - password
    *       - name
    *     properties:
    *       email:
    *         type: string
    *       password:
    *         type: string
    *       name:
    *         type: string
    */

    /**
     * @swagger
     * /register:
     *  post:
     *    description : This is for user registration
     *    produces: 
     *      - application/json
     *    parameters:
     *      - name: user
     *        in: body
     *        required: true
     *        schema:
     *           type: object
     *           $ref: '#/definitions/Register'
     *    responses:
     *       200:
     *         description: User successfully registered
     *    
     */
    app.post('/register', (req, res) => {
        if (req.body && req.body.name && req.body.email && req.body.password) {
            bcrypt.hash(req.body.password, 10, function (err, hash) {
                if (!err) {
                    user.add(req.body.name, req.body.email, hash, function (err, result) {
                        if (!err) {
                            res.send({
                                success: true,
                                data: "User successfully registered"
                            });
                        } else {
                            res.send({
                                success: false,
                                data: "Failed to registered"
                            });
                        }
                    })
                } else {
                    res.send({
                        success: false,
                        error: "Something went wrong"
                    })
                }
            });
        } else {
            res.send({
                success: false,
                error: "Invalid or missing input values"
            })
        }
    })

    /**
    * @swagger
    * definitions:
    *   Login:
    *     required:
    *       - email
    *       - password
    *     properties:
    *       email:
    *         type: string
    *       password:
    *         type: string
    */

    /**
     * @swagger
     * /login:
     *  post:
     *    description : This is for user login
     *    produces:
     *      - application/json
     *    parameters:
     *      - name: credentials
     *        in: body
     *        required: true
     *        schema:
     *           type: object
     *           $ref: '#/definitions/Login'
     *    responses:
     *       200:
     *         description: User successfully loggedin
     *
     */
    app.post('/login', (req, res) => {
        if (req.body && req.body.email && req.body.password) {
            user.getByEmail(req.body.email, function (err, result) {
                if (!err && result && result.length > 0) {
                    bcrypt.compare(req.body.password, result[0].password, function (err, hash) {
                        if (!err) {
                            result[0].password = undefined;
                            let token = jwt.sign(result[0], jwtSecret, { algorithm: 'HS256' });
                            res.send({
                                success: true,
                                data: {
                                    user: result[0],
                                    token: token
                                }
                            });
                        } else {
                            res.send({
                                success: false,
                                error: "Wrong password"
                            })
                        }
                    });
                } else {
                    res.send({
                        success: false,
                        error: err
                    });
                }
            });

        } else {
            res.send({
                success: false,
                error: "Invalid or missing input values"
            })
        }
    })

    /**
     * @swagger
     * /users:
     *  get:
     *    description : This is to get list users
     *    produces:
     *      - application/json
     *    parameters:
     *       - name: token
     *         in: header
     *         required: true
     *         type: string
     *    responses:
     *       200:
     *         description: List of users
     *
     */
    app.get('/users', isAuthenticated, (req, res) => {
        var result = user.getAll(function (err, result) {
            if (!err) {
                res.send({
                    success: true,
                    data: result
                });
            } else {
                res.send({
                    success: false,
                    error: err
                });
            }
        })
    })

    /**
     * @swagger
     * /user/{id}:
     *  get:
     *    description : This is to get user
     *    produces:
     *      - application/json
     *    parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         type: integer
     *       - name: token
     *         in: header
     *         required: true
     *         type: string
     *    responses:
     *       200:
     *         description: Get user
     *
     */
    app.get('/user/:id', isAuthenticated, (req, res) => {
        var result = user.getById(req.params.id, function (err, result) {
            if (!err && result && result.length > 0) {
                res.send({
                    success: true,
                    data: result[0]
                });
            } else {
                res.send({
                    success: false,
                    error: err
                });
            }
        })
    })

    function isAuthenticated(req, res, next) {
        if (typeof req.headers.token !== "undefined") {
            jwt.verify(req.headers.token, jwtSecret, { algorithm: "HS256" }, (err, user) => {
                if (err) {
                    res.status(500).json({ error: "Not Authorized" });
                    throw new Error("Not Authorized");
                }
                return next();
            });
        } else {
            res.status(500).json({ error: "Not Authorized" });
            throw new Error("Not Authorized");
        }
    }
}

module.exports = appRoutes;