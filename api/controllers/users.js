let express     = require('express');
let router      = express.Router();
let validator   = require('node-input-validator');
var HttpStatus = require('http-status-codes');

let logger = console;

let UserService = require('../../services/UserService');
let isAuthenticated = require('../../services/authintcationService').isAuthenticated;

router.post('/signup', registerUser);
router.post('/signin', loginUser);
router.get('/profile/:user_id', isAuthenticated, getUserProfile);
router.post('/profile/update/:user_id', isAuthenticated, edittUserProfile);


function registerUser (req, res, next) {

    return new Promise((resolve,reject) => {
        let v = new validator(req.body, {
                                        email:'required|email', 
                                        password:'required',
                                     }
                        );

        v.check().then(function (matched) {
            if( ! matched){
                return res.status(HttpStatus.BAD_REQUEST).send({
                    errMessage: v.errors,
                    error: true,
                    data : {}
                });
            }
            else
            {   
                UserService.emailCheck(req.body.email).then((values) => {

                        UserService.registerUser(req.body).then(val => {
                
                            res.status(HttpStatus.CREATED);
                            res.send({
                                errMessage: null,
                                error: false,
                                data : val
                            }); 
                            
                        }).catch(err => {
                            logger.error(err);
                            res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                                res.send({
                                    errMessage: err.message,
                                    error: true,
                                    data : {}
                                });
                        });
                    }).catch(err => {
                        logger.error(err);
                        return res.status(HttpStatus.BAD_REQUEST).send({
                        errMessage: 'this email is already taken',
                        error: true,
                        data : {}
                    });
                });     
            }
        });
    });
};

function loginUser (req, res, next) {

    return new Promise((resolve,reject) => {

        	let v = new validator(req.body, {
                                                email:'required|email', 
                                                password:'required',
                                             }
                                );

            v.check().then(function (matched) {
                if( ! matched){
                    return res.status(HttpStatus.BAD_REQUEST).send({
                        errMessage: v.errors,
                        error: true,
                        data : {}
                    });
                }
                else
                {
                    UserService.loginUser(req.body).then(val => {
                        res.status(HttpStatus.OK);
                        res.send({
                            errMessage: null,
                            error: false,
                            data : val
                        }); 
                    }).catch(err => {
                        logger.error(err);
                        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                            res.send({
                                errMessage: err,
                                error: true,
                                data : {}
                            });
                    });
                }
            });

    });
};

function getUserProfile (req, res, next) {

    UserService.getUserProfile(req.params.user_id).then(val => {
        if(val)
        {
            res.status(HttpStatus.OK);
            res.send({
                errMessage: null,
                error: false,
                data : val
            });     
        }
        else
        {
            res.status(HttpStatus.BAD_REQUEST);
            res.send({
                errMessage: 'no records found',
                error: false,
                data : {}
            });   
        }
    }).catch(err => {
        logger.error(err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
            res.send({
                errMessage: err,
                error: true,
                data : {}
            });
    });
};

function edittUserProfile (req, res, next) {
    UserService.edittUserProfile(req.params.user_id, req.body).then(val => {
        res.status(HttpStatus.OK);
        res.send({
            errMessage: null,
            error: false,
            data : val
        });     
    }).catch(err => {
        logger.error(err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
            res.send({
                errMessage: err,
                error: true,
                data : {}
            });
    });
};

module.exports = {
    router,
    registerUser,
    loginUser,
    getUserProfile,
    edittUserProfile
}