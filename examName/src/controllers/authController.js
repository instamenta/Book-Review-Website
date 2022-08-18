const router = require('express').Router();
const authService = require('../services/authService');

const { isAuthenticated } = require('../middlewares/authMid');
const { getErrorMessage } = require('../util');

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', async (req, res) => {
    const { username, email, password, repPass } = req.body;
    console.log(req.body)
    try {
        if (password.length < 3 || repPass.length < 3) {
            throw {
                message: 'Password must be at least 3 chars long!',
            };
        }
        if (email.length < 10) {
            throw {
                message: 'Email must be at least 10 characters long'
            }
        }
        if (username.length < 4) {
            throw {
                message: 'Username must be at least 4 characters long'
            }
        }
        if (password !== repPass) {
            throw {
                message: 'Passwords must match!',
            };
        }
        const token = await authService.register(username, email, password);

        res.cookie('session', token, { httpOnly: true });

        res.redirect('/');
    } catch (error) {
        res.render('auth/register', { ...req.body, error: getErrorMessage(error) });
    }
});

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (password.length < 3) {
            throw {
                message: 'Password must be at least 3 chars long!',
            };
        }
        if (email.length < 10) {
            throw {
                message: 'Email must be at least 10 characters long'
            }
        }
        console.log(req.body);

        const token = await authService.login(email, password);

        res.cookie('session', token, { httpOnly: true });

        res.redirect('/');
    } catch (error) {
        res.render('auth/login', { ...req.body, error: getErrorMessage(error) });
    }
});

router.get('/logout', isAuthenticated, (req, res) => {
    res.clearCookie('session');
    res.redirect('/');
});

module.exports = router;