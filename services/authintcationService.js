let express = require('express');
const request = require('request');
const jwt = require('jsonwebtoken');
let logger = console;
let HttpStatus = require('http-status-codes');

let ValidateToken = (token) => {
    return new Promise((resolve, reject) => {

        var decodedJwt = jwt.decode(token, { complete: true });
        if (!decodedJwt) {
            logger.error("Not a valid JWT token");
            reject("Not a valid JWT token");
            return;
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, payload) {
            if (err) {
                logger.error("Invalid Token.");
                reject(err.message);
            } else {
                logger.log("Valid Token.");
                resolve(payload);
            }
        });
                
    });
}

module.exports.isAuthenticated = (req, res, next) => {
    new Promise(() => {
        ValidateToken(req.headers['x-api-key']).then(val=> {

            if(req.params.user_id  != val)
            {
                return res.status(HttpStatus.UNAUTHORIZED).send({
                    errMessage: 'signature mis match',
                    error: true,
                    data : {}
                });
            }

            req.userId = val;
            next();
        }).catch(err => {
            res.status(HttpStatus.UNAUTHORIZED).send({
                error: true,
                data: err
            });
        });
    })
};