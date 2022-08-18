const User = require('../models/User');
const bcrypt = require('bcrypt');
const { SECRET } = require('../config/constants');
const { jwtSign } = require('../util');

exports.register = async (username, email, password) => {
    try {
        const hashedPass = await bcrypt.hash(password, 10);

        const createdUser = await User.create({ username, email, password: hashedPass });

        const token = await signToken(createdUser);

        return token;
    } catch (error) {
        throw error;
    }
};

exports.login = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        console.log(user.password);

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            throw {
                message: 'Wrong username or password!',
            };
        }

        const token = await signToken(user);

        return token;
    } catch (error) {
        throw {
            message: 'Username or pasword incorrect!',
        };
    }
};

const signToken = user => {
    const token = jwtSign(
        {
            _id: user._id,
            username: user.username,
            email: user.email,
        },
        SECRET,
        { expiresIn: '2d' },
    );

    return token;
};