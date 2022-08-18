const { SECRET } = require('../config/constants');
const { jwtVerify } = require('../util');

exports.authenticate = async (req, res, next) => {
    const token = req.cookies['session'];

    if (token) {
        try {
            const user = await jwtVerify(token, SECRET);

            res.locals.user = user;
            req.user = user;
        } catch (error) {
            return res.render('home/404');
        }
    }
    next();
};

exports.isAuthenticated = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    next();
};