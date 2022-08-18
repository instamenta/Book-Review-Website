const { promisify } = require('util');

const jwt = require('jsonwebtoken');

exports.jwtSign = promisify(jwt.sign);

exports.jwtVerify = promisify(jwt.verify);

exports.getErrorMessage = err => {
    let errorMessage = err.message;

    if (err.errors) {
        errorMessage = Object.values(err.errors)[0].message;
    }

    return errorMessage;
};