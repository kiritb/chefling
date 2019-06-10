const request   = require('request');
const sqLize    = require('sequelize');
global.fetch    = require('node-fetch');

let sequelize       = require('../utils').sequelize;
let users           = require('../models/users').users;
let bcrypt          = require('bcryptjs');
let jwt             = require('jsonwebtoken');


let logger = console;

let registerUser = (userObj) => {
     return new Promise((resolve, reject) => {
        users.create( {
            email : userObj.email, 
            password:bcrypt.hashSync(userObj.password, 10),
            name : userObj.name,
            status : 1,
            created_at: new Date(),
            updated_at: new Date(),
            created_by:userObj.email,
            updated_by:userObj.email
        } ).then((values) => {
            resolve(values);
        }).catch(err => {
            reject(err);
        })
    });
};


let loginUser = (userObj) => {
    return new Promise((resolve,reject) => {
        users.findAll({where: { email: userObj.email, status:1 }}).then((values) => {
            values.forEach((l) => {
                let userDetails = l.get({ plain: true })
                if (values && bcrypt.compareSync(userObj.password, userDetails.password)) {
                    let userId      = userDetails.id
                    token = jwt.sign(userId, process.env.JWT_SECRET_KEY);
                    delete userDetails.password;
                    userDetails['token'] = token 
                    resolve(userDetails);
                }
                else{
                    reject('invalid password');
                }
            });       
        }).catch(err => {
            reject(err);
        })
    });
}

let getUserProfile = (userId) => {
    return new Promise((resolve,reject) => {
        users.findAll({where: { id: userId, status:1 }}).then((values) => {
            resolve(values);
        }).catch(err => {
            reject(err);
        })
    });
}

let edittUserProfile = (userId,userObj) => {
    return new Promise((resolve,reject) => {
        users.findAll({where: { id: userId, status:1 } , raw:1 }).then((values) => {
            if(values.length > 0)
            {   
                let updateObj = {};
                
                if( userObj.password ) {
                    updateObj.password = bcrypt.hashSync(userObj.password,10);
                }

                if( userObj.name ) {
                    updateObj.name = userObj.name
                }

                updateObj.updated_at = new Date();
                updateObj.updated_by = values[0].email;

                users.update( updateObj, { where: { id: userId }} ).then((update) => {
                    delete updateObj.password;
                    resolve(updateObj);
                }).catch(err => {
                    reject(err);
                })
            }
            else
            {
                reject('No records found');
            }
        });
    });
}

let emailCheck = (userEmail) => {
    return new Promise((resolve,reject) => {
        users.findAll({where: { email: userEmail, status:1 }}).then((values) => {
            if(values.length > 0)
            {
                reject();    
            }
            else
            {
                resolve();    
            }
        }).catch(err => {
            reject(err);
        })
    });
}


module.exports = {
    registerUser,
    loginUser,
    edittUserProfile,
    getUserProfile,
    emailCheck
}